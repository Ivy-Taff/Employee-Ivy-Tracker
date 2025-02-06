import { pool } from './connection.js';

const seedDatabase = async () => {
  try {
    console.log('Seeding the database...');

    // Insert Departments
    await pool.query(`
      INSERT INTO department (name) VALUES 
      ('Engineering'),
      ('HR'),
      ('Finance')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Insert Roles
    await pool.query(`
      INSERT INTO role (title, salary, department_id) VALUES 
      ('Software Engineer', 80000, 1),
      ('HR Manager', 60000, 2),
      ('Accountant', 70000, 3)
      ON CONFLICT (title) DO NOTHING;
    `);

    // Insert Employees
    await pool.query(`
      INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
      ('John', 'Doe', 1, NULL),
      ('Jane', 'Smith', 2, NULL),
      ('Emily', 'Johnson', 3, 1)
      ON CONFLICT (first_name, last_name) DO NOTHING;
    `);

    console.log('Database seeding completed.');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    pool.end(); // Close the database connection
  }
};

// Run the seed function
seedDatabase();
