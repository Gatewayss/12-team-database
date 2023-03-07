const inquirer = require('inquirer');

const firstQuestion = [
    {
        name: 'action',
        message: 'What would you like to do?',
        choices: ['Add Employee', 'Update Employee', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
        type: 'list'
    }
]

function startApplication() {
    return inquirer.prompt(firstQuestion)
        .then((answers) => {
            console.log(answers);
            // startApplication()
        })
};

startApplication()