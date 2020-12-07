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
    query = queryList.employeeList
    
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
    connection.query(queryList.managerList, function(err, res){
        if (err) throw err;
        managerList = res;
        let employeeList = res.map(employee => employee.name);
        employeeList.push('none');
        let queryAdd = new q.queryAdd("manager", "does this employee have a manager?", employeeList)
        choices.push(queryAdd);
    });
    connection.query(roleQuery, function(err, res){
        if (err) throw err;
        roleList = res
        choices.push(new q.queryAdd('role', 'What is this employees title?', roleList.map(role => role.title)));  
        inquirer
            .prompt(choices)
            .then(answer => {
                let newPerson = answer;
                managerId = managerList.filter(e => e.name === newPerson.manager).map(id => id.id).shift();
                if (managerId){
                    newPerson.managerId = managerId;
                }else{
                    newPerson.managerId = null;
                }
                newPerson.roleId = roleList.filter(r => r.title === newPerson.role).map(id => id.id).shift();
                
                connection.query(
                    queryList.postEmployee, 
                    {
                        first_name:newPerson.firstName,
                        last_name:newPerson.lastName,
                        role_id:newPerson.roleId,
                        manager_id:newPerson.managerId
                    },
                    function(err, res){
                        if (err) throw err;
                        console.log(newPerson.firstName + " added");
                        startQ();
                    }
                )
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
            connection.query(
                queryList.postDepartment, {name:answer.departmentName}, function(err, res){
                    if (err) throw err;
                    console.log(answer.departmentName + " department added");
                    startQ();
                }

            )
        
        })
        .catch(err => {
        if(err) throw err;
        });
}

function addRole(){
    connection.query(queryList.deptList, function(err, res){
        if (err) throw err;
        console.log("here");
        let deptList = res;
        let deptListNames = res.map(dept => dept.name);
        let queryAdd = new q.queryAdd("department", "Which department is this role in?", deptListNames)
        let choices = q.addRole;
        choices.push(queryAdd);

        inquirer
            .prompt(choices)
            .then(answer => {
                const newRole = answer;
                newRole.departmentId = deptList.filter(d => d.name === newRole.department).map(id => id.id).shift();
                console.log(newRole);
                connection.query(queryList.postRole, 
                {
                    title:newRole.role,
                    salary:newRole.salary,
                    department_id:newRole.departmentId
                }, 
                function(err, res){
                    if (err) throw err;
                    startQ();
                });
            })
            .catch(err => {
            if(err) throw err;
            });
    });
}

function removeEmployee(){
    connection.query(queryList.managerList, function(err, res){
        if (err) throw err;
        let choices = []
        let list = res
        let nameList = res.map(name => name.name);
        choices.push(new q.queryAdd("delete", "Which employee would you like to delete?", nameList))
        inquirer
            .prompt(choices)
            .then(answer => {
                let id = list.filter(e => e.name === answer.delete).map(id => id.id).shift()
                connection.query(queryList.deleteEmployee, {id:id}, function(err, res){
                    if (err) throw err;
                    console.log("Employee deleted.")
                    startQ();
                });
            })
            .catch(err => {
                if (err) throw err;
            });
    });
}

function removeDepartment(){

    connection.query(queryList.deptList, function(err, res){
        if (err) throw err;
        let choices = []
        let list = res
        let deptList = res.map(dept => dept.name);
        choices.push(new q.queryAdd("delete", "Which department would you like to delete?", deptList))
        inquirer
            .prompt(choices)
            .then(answer => {
                let id = list.filter(d => d.name === answer.delete).map(id => id.id).shift()
                let deptName = list.filter(d => d.name === answer.delete).map(name => name.name).shift()
                console.log(id);
                console.log(deptName);

                connection.query(queryList.roleListDept, function(err, res){
                    if (err) throw err;
                    let deleteRoles = res.filter(r => r.department_name === deptName).map(r => r.id);

                    connection.query(queryList.deleteEmployees + deleteRoles +")", function(err, res){
                        if (err) throw err;
                        console.log('employees deleted');

                        connection.query(queryList.deleteRoles + deleteRoles +")", function(err, res){
                            if (err) throw err;
                            console.log('roles deleted');

                            connection.query(queryList.deleteDepartment,{id:id},function(err, res){
                                if (err) throw err;
                                console.log("Department deleted.")
                                startQ();
                            });
                            
                        })
                    })  
                })
            });
    });
}

function removeRole(){
    connection.query(queryList.roleList, function(err, res){
        if (err) throw err;
        let choices = []
        let list = res
        let roleList = res.map(role => role.title);
        choices.push(new q.queryAdd("delete", "Which role would you like to delete?", roleList))
        inquirer
            .prompt(choices)
            .then(answer => {
                let id = list.filter(e => e.title === answer.delete).map(id => id.id).shift()
                connection.query(
                    queryList.deleteEmployee,
                    {role_id:id},
                    function(err, res){
                        if (err) throw err;
                        connection.query(
                            queryList.deleteRole,
                            {id:id},
                            function(err, res){
                                if (err) throw err;
                                console.log("Role deleted.")
                                startQ();
                        });
                    })
            });
    });
}

function updateRole(){
    connection.query(queryList.managerList, function(err, res){
        if(err) throw err;
        let employeeList = res;
        connection.query(queryList.roleList, function(err, res){
            if (err) throw err;
            let roleList = res;
            let employeeNames = employeeList.map(e => e.name);
            let roleName = roleList.map(r => r.title);
            inquirer
                .prompt([
                    new q.queryAdd("employee", "Which employees role would you like to update", employeeNames), 
                    new q.queryAdd("role", "What role would you like to assign this employee?", roleName)])
                .then(answers => {
                    let roleId = roleList.filter(r => r.title === answers.role).map(r => r.id)
                    connection.query(queryList.updateEmployeeRole, {role_id:roleId}, function(err, res){
                        if (err) throw err;
                        console.log("employee updated");
                    })
                })
                .catch()
        })
    })
}

function updateDepartment(){

}

function updateManager(){

}

function viewRoles(){
    connection.query(queryList.roleListDept, function(err, res){
        if(err) throw err;
        console.table(res);
        startQ();
    })
}

function viewDepartments(){
    connection.query(queryList.deptList, function(err, res){
        if(err) throw err;
        console.table(res);
        startQ();
    })

}

function viewBudget(){

}

function quit(){

}