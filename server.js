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
    .prompt(q.homeBase)
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
            case 'update employee department' : updateDepartment(); break;
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



function getEmployees(byType){
    console.log("by Type " +byType); 
    query ="SELECT first_name, last_name, title, salary, " +
    "name as department_name FROM employee LEFT JOIN role ON role_id = role.id " +
    "LEFT JOIN department ON department_id = department.id";
    if(byType === "department") {query += " ORDER BY department_name";}
    if(byType === "manager") {
        query ="SELECT t.first_name, t.last_name, e.first_name as manager_name, e.last_name as manager_surname" +
        " FROM employee as t LEFT JOIN employee as e ON t.manager_id = e.id"
    }
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table(res);
        startQ()
    });
}

function addEmployee(){
    const query = "SELECT name, id FROM department"
    const query2 = "SELECT title, id FROM role"
    let choices = q.addEmployee
    connection.query(query, function(err, res){
        if (err) throw err;
        let deptList = res.map(dept => dept.name);
        let queryAdd = new q.queryAdd("department", "Which department is this employee in?", deptList)
        choices.push(queryAdd);
    });
    connection.query(query2, function(err, res){
        if (err) throw err;
        let roleList = res.map(role => role.title);
        let queryAdd = new q.queryAdd('role', 'What is this employees title?', roleList);
        choices.push(queryAdd);  
        inquirer
            .prompt(choices)
            .then(answer => {
            console.log(answer);
            })
            .catch(err => {
            if(err) throw err;
            });  
    });
         
}


function addDepartment(){

}

function addRole(){

}

function removeEmployee(){

}

function removeDepartment(){

}

function removeRole(){

}

function updateRole(){

}

function updateDepartment(){

}

function updateManager(){

}

function viewRoles(){

}

function viewDepartments(){

}

function viewBudget(){

}

function quit(){

}