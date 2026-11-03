const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '3306'),
  multipleStatements: true
};

// Usuarios de demostración (el schema.sql no los crea, solo los anunciaba)
const DEMO_USERS = [
  { email: 'admin@goalkeeper.com', password: 'Admin123!', name: 'Admin', role: 'admin' },
  { email: 'coach@goalkeeper.com', password: 'Admin123!', name: 'Coach', role: 'coach' },
];

async function initializeDatabase() {
  let connection;

  try {
    console.log('🔄 Conectando a MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado a MySQL');

    // Leer el archivo SQL
    const fs = require('fs');
    const path = require('path');
    const sqlPath = path.join(__dirname, 'schema.sql');
    let sql = fs.readFileSync(sqlPath, 'utf8');

    // El comando DELIMITER solo lo entiende el cliente mysql en terminal:
    // enviado por protocolo, el servidor lo rechaza con error de sintaxis.
    // El servidor sí sabe parsear el TRIGGER con su bloque BEGIN...END
    // dentro de una ejecución multi-statement, así que basta con quitar
    // esas líneas y cerrar el bloque con punto y coma. Se añade además
    // DROP TRIGGER IF EXISTS para poder re-ejecutar sin errores.
    sql = sql
      .split('\n')
      .filter((line) => !/^DELIMITER\b/i.test(line.trim()))
      .join('\n')
      .replace(/END\s*\/\/\s*$/gm, 'END;')
      .replace(
        /CREATE\s+TRIGGER\s+before_insert_refresh_token/gi,
        'DROP TRIGGER IF EXISTS before_insert_refresh_token;\nCREATE TRIGGER before_insert_refresh_token'
      );

    console.log('🔄 Ejecutando script SQL...');
    await connection.query(sql);
    console.log('✅ Base de datos creada exitosamente');

    // Crear usuarios demo (idempotente: no duplica si ya existen)
    for (const u of DEMO_USERS) {
      const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [u.email]);
      if (rows.length > 0) {
        console.log(`   - ${u.email}: ya existe, lo salto.`);
        continue;
      }
      const hash = await bcrypt.hash(u.password, 10);
      await connection.execute(
        'INSERT INTO users (email, password_hash, name, role, is_active, email_verified) VALUES (?, ?, ?, ?, 1, 1)',
        [u.email, hash, u.name, u.role]
      );
      console.log(`   - ${u.email}: creado.`);
    }

    console.log('\n📊 Resumen:');
    console.log('   - Base de datos: goalkeeper_training');
    console.log('   - Tablas: 14 tablas creadas');
    console.log('   - Vistas: 3 vistas creadas');
    console.log('   - Triggers: 1 trigger');
    console.log('   - Usuarios demo creados: 2');
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
