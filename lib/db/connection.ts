import mysql from 'mysql2/promise';

// Configuración de la conexión a MySQL
// Aiven y otras bases de datos en la nube exigen conexión cifrada (TLS):
// se activa poniendo DB_SSL=true. Si pegas el certificado CA de Aiven en
// DB_SSL_CA se verifica al máximo; si no, se cifra sin verificar el CA.
const useSSL = process.env.DB_SSL === 'true';
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'goalkeeper_training',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(useSSL
    ? {
        ssl: process.env.DB_SSL_CA
          ? { ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n') }
          : { rejectUnauthorized: false },
      }
    : {}),
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para testear la conexión
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Función para ejecutar queries
export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T> {
  try {
    const [results] = await pool.execute(sql, params);
    return results as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Función para ejecutar transacciones
export async function transaction<T>(callback: (connection: unknown) => Promise<T>): Promise<T> {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export default pool;
