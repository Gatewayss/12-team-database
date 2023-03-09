const inquirer = require('inquirer');
const mysql = require('mysql2');

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
        choices: ['Add Employee', 'Update Employee', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
        type: 'list'
    }
]

const newDepartment = [
    {
        name: 'newDepartment',
        message: "What's the new department you want to add?",
        type: 'input'
    }
];

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
                        .then(() => console.log(`Added new role to the database`))
                        .then(() => startApplication())
                })
        })

};

const newEmployee = [
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
        name: 'empRole',
        message: "What role is this employee",
        choices: []
    },
    {
        name: 'managerID',
        message: "Who's the manager?",
        choices: []
    }
];

async function startApplication() {
        inquirer.prompt(firstQuestion)
        .then(answers => {
        switch (answers.action) {
            case 'Add Employee':
                const newEmpQuestions = inquirer.prompt(newEmployee)
                const firstName = newEmpQuestions.firstName;
                const lastName = newEmpQuestions.lastName;
                const empRole = newEmpQuestions.empRole;
                const manager = newEmpQuestions.managerID
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName, lastName, empRole, manager}')`, function (err, results) {
                    console.log(`\n\n ${firstName} was added!\n`);
                    startApplication()
                });
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Department':
                const newDepQuestion = inquirer.prompt(newDepartment)
                const newDep = newDepQuestion.newDepartment;
                connection.query(`INSERT INTO department (name) 
                VALUES ('${newDep}')`, function (err, results) {
                    console.log(`\n\n ${newDep} department was added!\n`);
                    startApplication()
                });
                break;
            case 'View All Roles':
                connection.query('SELECT id, title FROM role',
                    function (err, results) {
                        console.log(results);
                        startApplication()
                    });
                break;
            case 'View All Departments':
                connection.query('SELECT * FROM department',
                    function (err, results) {
                        console.log(results);
                        startApplication()
                    });
                break;
            case 'Quit':
                connection.end();
                break;
        }
    })
};

startApplication()