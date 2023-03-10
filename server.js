// Required npm's
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'team_db',
    password: 'steph'
});

const firstQuestion = [
    {
        name: 'action',
        message: 'What would you like to do?',
        choices: ['Add Employee', 'Update Employees Role', 'View All Roles', 'View All Employees', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
        type: 'list'
    }
];

const newDepartment = [
    {
        name: 'newDepartment',
        message: "What's the new department you want to add?",
        type: 'input'
    }
];

// Queries everything the debarment table and maps out a new object with all the relevant info
function addRole() {
    connection.promise().query(`SELECT * FROM department`)
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            inquirer.prompt([
                {
                    name: "title",
                    message: "What is the name of the role?"
                },
                {
                    name: "salary",
                    message: "What is the salary of the role?"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Which department does the role belong to?",
                    choices: departmentChoices
                }
            ])
                .then(role => {
                    connection.promise().query(`INSERT INTO role (title, salary, department_id) VALUES ('${role.title}', ${role.salary},'${role.department_id}')`)
                        .then(() => console.log(`\nAdded ${role.title} to the database\n`))
                        .then(() => startApplication())
                })
        })

};

// Grabs the current roles and managers for the new employee
function addEmployee() {
    connection.promise().query(`SELECT * FROM role`)
        .then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));

            connection.promise().query(`SELECT * FROM employee WHERE manager_id IS NOT NULL`)
                .then(([rows]) => {
                    let managers = rows;
                    let managerChoices = managers.map(({ id, first_name }) => ({
                        name: first_name,
                        value: id,
                    }));

                    // adds the none object to the array 
                    connection.promise().query(`SELECT * FROM employee WHERE manager_id IS NOT NULL`)
                        .then(([rows]) => {
                            let managers = rows;
                            managerChoices = [
                                { name: "None", value: null },
                                ...managers.map(({ id, first_name }) => ({
                                    name: first_name,
                                    value: id,
                                }))
                            ];

                            inquirer.prompt([
                                {
                                    name: 'firstName',
                                    message: "What's the first name of the employee?",
                                    type: 'input'
                                },
                                {
                                    name: 'lastName',
                                    message: "What's the last name of the employee",
                                    type: 'input'
                                },
                                {
                                    type: 'list',
                                    name: 'empRole',
                                    message: "What role is this employee",
                                    choices: roleChoices
                                },
                                {
                                    type: 'list',
                                    name: 'managerID',
                                    message: "Who's the manager?",
                                    choices: managerChoices
                                }
                            ]).then(employee => {
                                connection.promise().query(
                                    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
                                    [employee.firstName, employee.lastName, employee.empRole, employee.managerID]
                                )
                                    .then(() => console.log(`\n${employee.firstName} was added to the database!\n`))
                                    .then(() => startApplication())
                            })
                        })
                })
        });
}

// Grabs the employees role and replaces it with the new one
function updateEmployeeRole() {
    connection.promise().query(`SELECT * FROM employee`)
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name }) => ({
                name: first_name,
                value: id,
            }));
            connection.promise().query(`SELECT * FROM role`)
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'employeeID',
                            message: 'Which employee would you like to update?',
                            choices: employeeChoices
                        },
                        {
                            type: 'list',
                            name: 'newRole',
                            message: 'Which role would you like to update?',
                            choices: roleChoices
                        }
                    ]).then(employee => {
                        connection.promise().query(`UPDATE employee SET role_id = ${employee.newRole} WHERE id = ${employee.employeeID}`)
                            .then(() => console.log(`\nEmployee was updated to the database!\n`))
                            .then(() => startApplication())
                    })
                })
        })
};

// Based on the first question response the different case situations begin 
function startApplication() {
    inquirer.prompt(firstQuestion)
        .then(answers => {
            switch (answers.action) {
                case 'Update Employees Role':
                    updateEmployeeRole()
                    break;
                case 'Add Employee':
                    addEmployee()
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Department':
                    inquirer.prompt(newDepartment)
                        .then(department => {
                            const newDep = department.newDepartment;
                            connection.query(`INSERT INTO department (name) 
                    VALUES ('${newDep}')`, function (err, results) {
                                console.log(`\n${newDep} department was added!\n`);
                                startApplication()
                            });
                        });
                    break;
                case 'View All Roles':
                    connection.query('SELECT * FROM role',
                        function (err, results) {
                            console.table(results);
                            startApplication()
                        });
                    break;
                case 'View All Departments':
                    connection.query('SELECT * FROM department',
                        function (err, results) {
                            console.table(results);
                            startApplication()
                        });
                    break;
                case 'View All Employees':
                    connection.query("SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;", function (err, results) {
                        console.table(results);
                        startApplication()
                    })
                    break;
                case 'Quit':
                    connection.end();
                    break;
            }
        })
};

// init application
startApplication()