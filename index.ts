import inquirer from 'inquirer';
import { pool } from './src/db/connection';

const mainMenu = async () => {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]);

    switch (action) {
        case 'View all departments':
            await viewDepartments();
            break;
        case 'View all roles':
            await viewRoles();
            break;
        case 'View all employees':
            await viewEmployees();
            break;
        case 'Add a department':
            await addDepartment();
            break;
        case 'Add a role':
            await addRole();
            break;
        case 'Add an employee':
            await addEmployee();
            break;
        case 'Update an employee role':
            await updateEmployeeRole();
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit(0);
    }

    mainMenu();
};

// Functions to interact with the database

const viewDepartments = async () => {
    const { rows } = await pool.query('SELECT * FROM department');
    console.table(rows);
};

const viewRoles = async () => {
    const { rows } = await pool.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id');
    console.table(rows);
};

const viewEmployees = async () => {
    const { rows } = await pool.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employee 
        JOIN role ON employee.role_id = role.id 
        JOIN department ON role.department_id = department.id 
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    `);
    console.table(rows);
};

const addDepartment = async () => {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the new department:',
        }
    ]);
    await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added new department: ${name}`);
};

const addRole = async () => {
    const { title, salary, departmentId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the role title:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for this role:',
        },
        {
            type: 'input',
            name: 'departmentId',
            message: 'Enter the department ID for this role:',
        }
    ]);
    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]);
    console.log(`Added new role: ${title}`);
};

const addEmployee = async () => {
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter employee first name:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter employee last name:',
        },
        {
            type: 'input',
            name: 'roleId',
            message: 'Enter the role ID:',
        },
        {
            type: 'input',
            name: 'managerId',
            message: 'Enter the manager ID (or leave blank for none):',
        }
    ]);
    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId || null]);
    console.log(`Added new employee: ${firstName} ${lastName}`);
};

const updateEmployeeRole = async () => {
    const { employeeId, roleId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: 'Enter the ID of the employee to update:',
        },
        {
            type: 'input',
            name: 'roleId',
            message: 'Enter the new role ID:',
        }
    ]);
    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
    console.log(`Updated employee ID ${employeeId} with new role ID ${roleId}`);
};

// Connect to the database and start the app
import { connectToDb } from './src/db/connection';

connectToDb().then(() => mainMenu());
