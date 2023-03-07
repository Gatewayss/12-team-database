const inquirer = require('inquirer');
const mysql = require('mysql2');

const firstQuestion = [
    {
        name: 'action',
        message: 'What would you like to do?',
        choices: ['Add Employee', 'Update Employee', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
        type: 'list'
    }
]

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'team_db',
    password: 'steph'
  });

function startApplication() {
    return inquirer.prompt(firstQuestion)
        .then((answers) => {
            console.log(answers);
            // startApplication()
        })
};

startApplication()