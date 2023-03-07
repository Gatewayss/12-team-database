const inquirer = require('inquirer');
const mysql = require('mysql2');
let inProgress = true;

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

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'team_db',
    password: 'steph'
});

async function startApplication() {
    let inProgress = true;
    while (inProgress) {
        const answers = await inquirer.prompt(firstQuestion)
        switch (answers.action) {
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