const mysql = require('mysql');
const inquirer = require('inquirer');
const q = require('./lib/questions.js');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user:"root",
    password:"password",
    database:"employeeDB"
});

connection.connect(function(err) {
    if (err) throw err;
    startQ();
});

function startQ() {
    inquirer
    .prompt(q)
    .then(answer => {
        console.log(answer)
        switch(answer.homeBase){
            case 'view all employees' : getEmployees(); break;
            case 'view all employees by department' : getEmployees('department'); break;
            case 'view all employees by manager' : getEmployees('manager'); break;
            case 'add employee' : addEmployee(); break;
            case 'add department' : addDepartment(); break;
            case 'add role' : addRole(); break;
            case 'remove employee' : removeEmployee(); break;
            case 'remove role' : removeRole(); break;
            case 'remove department' : removeDepartment(); break;
            case 'update employee role' : updateRole(); break;
            case 'update employee manager' : updateManager(); break;
            case 'view all roles' : viewRoles(); break;
            case 'view all departments' : viewDepartments(); break;
            case 'view budget' : viewBudget(); break;
            case 'quit' : break;
        }
    })
    .catch(err => {
        if(err) throw err;
    });
}



// function getEmployees(byType){
//     console.log("by Type " +byType); 
//     let query ="SELECT * FROM employee_table;";
//     console.log("here")
//     console.log(query);
//     connection.query(query, function(err, res){
//         if (err) throw err;
//         console.table(res);
//         startQ()
//     });
// }

