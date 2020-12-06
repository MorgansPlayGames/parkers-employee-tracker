const mysql = require('mysql');
const inquirer = require('inquirer');
const q = require('./lib/questions.js');
const queryList = require('./lib/query.js');


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
            case 'add employee' : getEmployeeDept(); break;
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
    query = queryList.getEmployees
    
    if(byType === "department") {query += " ORDER BY department_name";}
    if(byType === "manager") {
        query = queryList.employeesByManager
    }
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table(res);
        startQ()
    });
}

function getEmployeeDept(){
    connection.query(queryList.deptList, function(err, res){
        if (err) throw err;
        let depts = res;
        let deptNameList = res.map(dept => dept.name);
        let query = new q.queryAdd("department", "Which department is this employee in?", deptNameList);
        let choices = [];
        choices.push(query);
        inquirer
            .prompt(choices)
            .then(answer => {
                console.log(answer);
                let dept = depts.filter(d => d.name === answer.department);
                addEmployee(dept);
            })
            .catch(err => {
                if(err) throw err;
                //quit function?
            });
    });
}

function addEmployee(dept){
    let choices = q.addEmployee;
    let deptId = dept.map(id => id.id)
    let roleQuery = queryList.roleList + " WHERE department_id = " + deptId;
    let managerList 
    connection.query(queryList.peopleList, function(err, res){
        if (err) throw err;
        managerList = res;
        let employeeList = res.map(employee => employee.name);
        employeeList.push('none');
        let queryAdd = new q.queryAdd("manager", "does this employee have a manager?", employeeList)
        choices.push(queryAdd);
    });
    connection.query(roleQuery, function(err, res){
        if (err) throw err;
        roleList = res.map(role => role.title)
        choices.push(new q.queryAdd('role', 'What is this employees title?', roleList));  
        inquirer
            .prompt(choices)
            .then(answer => {
            let newPerson = answer;
            newPerson.managerId = managerList.filter(employee => employee.name === newPerson.manager).map(id => id.id).shift();
            newPerson.departmentId = dept.map(id => id.id).shift();
            console.log("Need to push to server")
            console.log(newPerson);
            startQ();
            })
            .catch(err => {
            if(err) throw err;
            });
    });
    
}

function addDepartment(){
    inquirer
        .prompt(q.addDepartment)
        .then(answer => {
            console.log("Need to push to server")
            console.log(answer);
        startQ()
        })
        .catch(err => {
        if(err) throw err;
        });
}

function addRole(){
    connection.query(queryList.deptList, function(err, res){
        if (err) throw err;
        let deptList = res;
        let deptListNames = res.map(dept => dept.name);
        let queryAdd = new q.queryAdd("department", "Which department is this role in?", deptListNames)
        let choices = [q.addRole, queryAdd];
        inquirer
            .prompt(choices)
            .then(answer => {
                const newRole = answer;
                newRole.departmentId = deptList.filter(dept => dept.name === newRole.department).map(id => id.id).shift();
                console.log("Need to push to server")
                console.log(newRole);
                startQ()
            })
            .catch(err => {
            if(err) throw err;
            });
    });
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