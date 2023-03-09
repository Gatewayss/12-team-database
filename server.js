const inquirer = require('inquirer');
const mysql = require('mysql2');
let inProgress = true;

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

const newRole = [
    {
        name: 'title',
        message: "What's the title of the new role?",
        type: 'input'
    },
    {
        name: 'salary',
        message: "What is the salary for this position?",
        type: 'input'
    },
    {
        name: 'depID',
        message: "What the department this role belongs to?",
        type: 'list',
        choices: []
    }
];

async function startApplication() {
    let inProgress = true;
    while (inProgress) {
        const answers = await inquirer.prompt(firstQuestion)
        switch (answers.action) {
            case 'Add Role':
                const newRoleQuestion = await inquirer.prompt(newRole)
                const roleTitle = newRoleQuestion.title;
                const roleSalary = newRoleQuestion.salary;
                const roleID = newRoleQuestion.depID;
                connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${roleTitle, roleSalary,roleID}')`, function (err, results) {
                    console.log(`\n\n ${roleTitle} role was added!\n`);
                    startApplication()
                });
                break;
            case 'Add Department':
                const newDepQuestion = await inquirer.prompt(newDepartment)
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
                inProgress = false;
                connection.end();
                break;
        }
    }
};

startApplication()