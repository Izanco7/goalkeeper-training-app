const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '3306'),
  multipleStatements: true
};

// Usuarios de demostración
const DEMO_USERS = [
  { email: 'admin@goalkeeper.com', password: 'Admin123!', name: 'Admin', role: 'admin' },
  { email: 'coach@goalkeeper.com', password: 'Admin123!', name: 'Coach', role: 'coach' },
];

// Errores "ya existe" que se ignoran al re-ejecutar (idempotencia).
// Se comprueba el código simbólico (e.code) y también el número (e.errno).
// Ojo: el error 1005 (ER_CANT_CREATE_TABLE) anida el errno del motor InnoDB
// dentro del mensaje, p. ej. (errno: 121 "Duplicate key..."): solo se ignora
// cuando el errno anidado es 121 (nombre duplicado = migración ya aplicada).
const DUP_CODES = new Set([
  'ER_TABLE_EXISTS_ERROR', // 1050
  'ER_DUP_FIELDNAME',      // 1060
  'ER_DUP_KEYNAME',        // 1061
  'ER_DUP_ENTRY',          // 1062
  'ER_FK_DUP_NAME',        // 121
  'ER_SP_ALREADY_EXISTS',  // 1304
]);
const DUP_ERRNOS = new Set([1050, 1060, 1061, 1062, 121, 1304]);

function isAlreadyApplied(e) {
  if (DUP_CODES.has(e.code) || DUP_ERRNOS.has(e.errno)) return true;
  return e.errno === 1005 && /errno:\s*121\b/.test(e.message || '');
}

// El comando DELIMITER solo lo entiende el cliente mysql en terminal:
// enviado por protocolo, el servidor lo rechaza con error de sintaxis.
// El servidor sí sabe parsear bloques BEGIN...END, así que basta con
// quitar esas líneas y cerrar los bloques con punto y coma.
// Además se añaden DROP IF EXISTS para poder re-ejecutar sin errores.
function preprocess(sql) {
  return sql
    .split('\n')
    .filter((line) => !/^DELIMITER\b/i.test(line.trim()))
    .join('\n')
    .replace(/END\s*\/\/\s*$/gm, 'END;')
    .replace(/CREATE\s+TRIGGER\s+(\w+)/gi, 'DROP TRIGGER IF EXISTS $1;\nCREATE TRIGGER $1')
    .replace(
      /CREATE\s+PROCEDURE\s+(?:IF\s+NOT\s+EXISTS\s+)?([\w.]+)/gi,
      'DROP PROCEDURE IF EXISTS $1;\nCREATE PROCEDURE $1'
    );
}

// Parte el SQL en sentencias sin romper los bloques
// CREATE PROCEDURE ... END; ni CREATE TRIGGER ... END;
function splitStatements(sql) {
  const blocks = [];
  const rest = sql.replace(/CREATE\s+(?:PROCEDURE|TRIGGER)\b[\s\S]*?^END;/gim, (m) => {
    blocks.push(m);
    return `\n__BLOCK_${blocks.length - 1}__\n`;
  });
  return rest
    .split(/;\s*\n/)
    .map((chunk) => {
      const m = chunk.match(/__BLOCK_(\d+)__/);
      if (m) return blocks[Number(m[1])].trim();
      const code = chunk
        .split('\n')
        .filter((line) => !line.trim().startsWith('--'))
        .join('\n')
        .trim();
      return code ? code + ';' : '';
    })
    .filter((s) => s.length > 0);
}

async function runSqlFile(connection, filePath, label) {
  const sql = preprocess(fs.readFileSync(filePath, 'utf8'));
  for (const stmt of splitStatements(sql)) {
    try {
      await connection.query(stmt);
    } catch (e) {
      if (isAlreadyApplied(e)) continue; // ya aplicado: se omite
      throw new Error(`${label}: ${e.message}`);
    }
  }
}

async function initializeDatabase() {
  let connection;

  try {
    console.log('🔄 Conectando a MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado a MySQL');

    // 1. Schema principal
    console.log('🔄 Schema principal...');
    await runSqlFile(connection, path.join(__dirname, 'schema.sql'), 'schema.sql');
    console.log('✅ Schema principal listo');

    // 2. Migraciones en orden alfabético
    const migDir = path.join(__dirname, 'migrations');
    const migFiles = fs.readdirSync(migDir).filter((f) => f.endsWith('.sql')).sort();
    for (const f of migFiles) {
      await runSqlFile(connection, path.join(migDir, f), f);
      console.log(`✅ Migración ${f}`);
    }

    // 3. Usuarios demo (idempotente: no duplica si ya existen)
    for (const u of DEMO_USERS) {
      const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [u.email]);
      if (rows.length > 0) {
        console.log(`   - ${u.email}: ya existe`);
        continue;
      }
      const hash = await bcrypt.hash(u.password, 10);
      await connection.execute(
        'INSERT INTO users (email, password_hash, name, role, is_active, email_verified) VALUES (?, ?, ?, ?, 1, 1)',
        [u.email, hash, u.name, u.role]
      );
      console.log(`   - ${u.email}: creado`);
    }

    // 4. Plan Elite para los usuarios demo (fork personal: sin límites)
    try {
      const [plans] = await connection.execute(
        "SELECT id FROM subscription_plans WHERE slug = 'elite' AND is_active = 1 LIMIT 1"
      );
      if (plans.length > 0) {
        for (const u of DEMO_USERS) {
          const [urows] = await connection.execute('SELECT id FROM users WHERE email = ?', [u.email]);
          if (urows.length === 0) continue;
          await connection.execute(
            `INSERT INTO user_subscriptions (user_id, plan_id, status, billing_cycle)
             VALUES (?, ?, 'active', 'lifetime')
             ON DUPLICATE KEY UPDATE plan_id = VALUES(plan_id), status = 'active'`,
            [urows[0].id, plans[0].id]
          );
        }
        console.log('✅ Plan Elite activado para los usuarios demo (sin límites)');
      }
    } catch (e) {
      console.log('   (aviso: no se pudo asignar el plan Elite: ' + e.message + ')');
    }

    console.log('\n📊 Resumen:');
    console.log('   - Base de datos: goalkeeper_training');
    console.log('   - Tablas y vistas creadas');
    console.log('   - Migraciones aplicadas');
    console.log('   - Usuarios demo: 2 (con plan Elite)');
    console.log('\n👤 Usuarios de prueba:');
    console.log('   1. Email: admin@goalkeeper.com');
    console.log('      Password: Admin123!');
    console.log('      Role: admin');
    console.log('\n   2. Email: coach@goalkeeper.com');
    console.log('      Password: Admin123!');
    console.log('      Role: coach');
    console.log('\n✨ ¡Base de datos lista para usar!');

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Ejecutar
initializeDatabase();
