/**
 * Seed de ejemplo: equipo "Cimino Academy" + los 3 porteros de Izan.
 *
 * Uso:
 *   node lib/db/seed-cimino.js --email=tucorreo@ejemplo.com
 *
 * Requiere que el usuario ya esté registrado en la app (el equipo se crea
 * a su nombre) y que la base de datos esté inicializada (npm run db:init).
 * Es idempotente: si el equipo o un portero ya existen, los reutiliza.
 */
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const TEAM = {
  name: 'Cimino Academy',
  category: 'Porteros 8-12 años',
  season: '2026-27',
  description: 'Grupo de 3 porteros entrenados por Izan (temporada 26-27).',
  color: '#16a34a',
};

// Apellidos, dorsales y fechas de nacimiento: completar desde la app.
const KEEPERS = [
  {
    first_name: 'Hugo',
    notes: 'Nuevo en el grupo, algo de base. Se distrae con facilidad: mantener la concentración es prioritario.',
  },
  {
    first_name: 'José',
    notes: 'El de nivel más flojo del grupo. Se distrae con facilidad: mantener la concentración es prioritario.',
  },
  {
    first_name: 'Vicente',
    notes: 'Ya entrenó con Izan hace dos años.',
  },
];

async function main() {
  const emailArg = process.argv.find((a) => a.startsWith('--email='));
  const email = emailArg ? emailArg.split('=')[1] : process.env.SEED_USER_EMAIL;

  if (!email) {
    console.error('Uso: node lib/db/seed-cimino.js --email=tucorreo@ejemplo.com');
    process.exit(1);
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goalkeeper_training',
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  try {
    const [users] = await conn.execute('SELECT id, email FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      console.error(`No existe ningún usuario con el email ${email}. Regístrate primero en la app.`);
      process.exit(1);
    }
    const userId = users[0].id;

    let teamId;
    const [existingTeams] = await conn.execute(
      'SELECT id FROM teams WHERE user_id = ? AND name = ?',
      [userId, TEAM.name]
    );
    if (existingTeams.length > 0) {
      teamId = existingTeams[0].id;
      console.log(`Equipo "${TEAM.name}" ya existe, lo reutilizo.`);
    } else {
      const [result] = await conn.execute(
        'INSERT INTO teams (name, category, season, description, color, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [TEAM.name, TEAM.category, TEAM.season, TEAM.description, TEAM.color, userId]
      );
      teamId = result.insertId;
      console.log(`Equipo "${TEAM.name}" creado.`);
    }

    for (const keeper of KEEPERS) {
      const [existing] = await conn.execute(
        'SELECT id FROM goalkeepers WHERE team_id = ? AND first_name = ?',
        [teamId, keeper.first_name]
      );
      if (existing.length > 0) {
        console.log(`- ${keeper.first_name}: ya existe, lo salto.`);
        continue;
      }
      await conn.execute(
        'INSERT INTO goalkeepers (first_name, last_name, team_id, notes) VALUES (?, ?, ?, ?)',
        [keeper.first_name, '', teamId, keeper.notes]
      );
      console.log(`- ${keeper.first_name}: creado.`);
    }

    console.log('Listo. Completa apellidos, dorsales y fechas de nacimiento desde la app.');
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('Error en el seed:', err.message);
  process.exit(1);
});
