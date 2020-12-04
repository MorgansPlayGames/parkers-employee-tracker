const mysql = require('mysql');
const inquirer = require('inquirer');
const q = require('./lib/questions.js');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3001,
    user:"root",
    password:"password",
    database:"employeeDB"
})

connection.connect(function(err) {
    if (err) throw err;
})

function startQ(ask) {
    inquirer
    .prompt(ask)
    .then(answers => {
        console.log(answers);
        if(answers.homeBase){
            theSwitch(answers.homeBase);
        }
    })
    .catch(err => {
        if(err) throw err;
    });
}

function theSwitch(searchKey) {
    switch(searchKey){
        case 'homeBase' : startQ(q);
            break;
        case 'view all employees' : getEmployees();
            break;
        case 'view all employees by department' : getEmployees('department');
            break;
        case 'view all employees by manager' : getEmployees('manager')
            break;
        case 'add employee' :
            break;
        case 'add department' :
            break;
        case 'add role' :
            break;
        case 'remove employee' :
            break;
        case 'remove role' :
            break;
        case 'remove department' :
            break;
        case 'update employee role' :
            break;
        case 'update employee manager' :
            break;
        case 'view all roles' :
            break;
        case 'view all departments' :
            break;
        case 'view budget' :
            break;
        case 'quit' :
            break;
    }
}

function getEmployees(byType){
    console.log(byType);
    switch(byType){
        case 'department' :
            console.log('employee by department');
            break;
        case 'manager' : 
            console.log('employee by manager')
            break;
    }

    theSwitch('homeBase');
}

theSwitch('homeBase');
