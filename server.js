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
        console.log(answers);
        switch (answers.action) {
            case 'Quit':
                inProgress = false;
                connection.end();
                break;
        }
    }
};

startApplication()