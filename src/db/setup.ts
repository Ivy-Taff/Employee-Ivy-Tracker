import { pool } from './connection.js';

const setupDatabase = async () => {
  try {
    console.log('Setting up the database...');

    // Create Department Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS department (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) UNIQUE NOT NULL
      );
    `);

    // Create Role Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS role (
        id SERIAL PRIMARY KEY,
        title VARCHAR(30) UNIQUE NOT NULL,
        salary DECIMAL NOT NULL,
        department_id INTEGER NOT NULL,
        FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
      );
    `);

    // Create Employee Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employee (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INTEGER NOT NULL,
        manager_id INTEGER,
        FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
        FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
      );
    `);

    console.log('Database schema created successfully.');
  } catch (error) {
    console.error('Error setting up the database:', error);
  } finally {
    pool.end(); // Close the database connection
  }
};

// Run the setup function
setupDatabase();
