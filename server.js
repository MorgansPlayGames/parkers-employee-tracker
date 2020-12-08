//requires
const mysql = require('mysql');
const inquirer = require('inquirer');

//created libraries
const q = require('./lib/questions.js');
const queryList = require('./lib/query.js');

//sql server information
var connection = mysql.createConnection({
    host: "localhost",
    //if not on Port 3306 change:
    port: 3306,
    //your username
    user:"root",
    //your password
    password:"password",
    database:"employeeDB"
});

//start server connection
connection.connect(function(err) {
    if (err) throw err;
    startQ();
});

//index function with access to other functions based on input
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
            case 'view all roles' : viewRoles(); break;
            case 'view all departments' : viewDepartments(); break;
            case 'view budget' : viewBudget(); break;
            case 'quit' : quit(); break;
        }
    })
    .catch(err => {
        if(err) throw err;
    });
}

//returns employee list/employee list by department/employee list by manager
function getEmployees(byType){ 
    query = queryList.employeeList
    if(byType === "department") {query += " ORDER BY department_name";}
    if(byType === "manager") {query = queryList.employeesByManager}
    connection.query(query, function(err, res){ 
        if (err) throw err;
        console.table(res);
        startQ()
        });
}

//asks what department the employee will be located in, then goes to the add employee function
function getEmployeeDept(){
    connection.query(queryList.deptList, function(err, res){
        if (err) throw err;
        inquirer
            .prompt([new q.queryAdd("department", "Which department is this employee in?", res.map(dept => dept.name))])
            .then(answer => {
                let dept = res.filter(d => d.name === answer.department);
                addEmployee(dept);
            })
            .catch(err => {
                if(err) throw err;
                quit();
            });
    });
}

//gets name, role, and manager for employee and posts to server
function addEmployee(dept){
    let choices = q.addEmployee;
    let roleQuery = queryList.roleList + " WHERE department_id = " + dept.map(id => id.id);
    let managerList 
    connection.query(queryList.managerList, function(err, res){
        if (err) throw err;
        managerList = res;
        let employeeList = res.map(employee => employee.name).push('none');
        choices.push(new q.queryAdd("manager", "does this employee have a manager?", employeeList));
    });
    connection.query(roleQuery, function(err, res){
        if (err) throw err;
        choices.push(new q.queryAdd('role', 'What is this employees title?', res.map(role => role.title)));  
        
        inquirer
            .prompt(choices)
            .then(answer => {
                let newPerson = answer;
                let managerId = managerList.filter(e => e.name === newPerson.manager).map(id => id.id).shift();
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

//gets department name and posts to server
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
            );
        })
        .catch(err => {
            if(err) throw err;
            quit();
        });
}

//gets role name and salary and posts to the server
function addRole(){
    connection.query(queryList.deptList, function(err, res){
        if (err) throw err;
        let deptList = res;
        let queryAdd = new q.queryAdd("department", "Which department is this role in?", res.map(d => d.name))
        let choices = q.addRole;
        choices.push(queryAdd);

        inquirer
            .prompt(choices)
            .then(answer => {
                const newRole = answer;
                newRole.departmentId = deptList.filter(d => d.name === newRole.department).map(id => id.id).shift();
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
//asks which employee they would like to delete and deletes the employee
function removeEmployee(){
    connection.query(queryList.managerList, function(err, res){
        if (err) throw err;
        let list = res
        let choices = [new q.queryAdd("delete", "Which employee would you like to delete?", res.map(e => e.name))]
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

//asks which department they would like to delete and deletes employees and roles located in the department in addition to department
function removeDepartment(){

    connection.query(queryList.deptList, function(err, res){
        if (err) throw err;
        let list = res
        let deptList = res.map(dept => dept.name);
        let choices = [new q.queryAdd("delete", "Which department would you like to delete?", deptList)]
        inquirer
            .prompt(choices)
            .then(answer => {
                let id = list.filter(d => d.name === answer.delete).map(id => id.id).shift()
                let deptName = list.filter(d => d.name === answer.delete).map(d => d.name).shift()
 
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
                            
                        });
                    }); 
                });
            });
    });
}

//asks which role they would like to delete and deletes employees within that role and the role
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
                connection.query(queryList.deleteEmployee,{role_id:id},
                    function(err, res){if (err) throw err;
                        console.log('employees deleted')
                        connection.query(queryList.deleteRole,{id:id},
                            function(err, res){
                                if (err) throw err;
                                console.log("Role deleted.")
                                startQ();
                        });
                });
            })
            .catch(err => {
                if (err) throw err;
            });
    });
}

//asks which employee and which role they will be assigned to, then updates the employee
function updateRole(){
    connection.query(queryList.managerList, function(err, res){
        if(err) throw err;
        let employeeList = res;
        connection.query(queryList.roleList, function(err, res){
            if (err) throw err;
            let roleList = res;
            inquirer
                .prompt([
                    new q.queryAdd("employee", "Which employees role would you like to update", employeeList.map(e => e.name)), 
                    new q.queryAdd("role", "What role would you like to assign this employee?", roleList.map(r => r.title))])
                .then(answers => {
                    let roleId = roleList.filter(r => r.title === answers.role).map(r => r.id).shift();
                    let employeeId = employeeList.filter(e => e.name === answers.employee).map(e => e.id).shift();
                    connection.query(queryList.updateEmployee, [{role_id:roleId},{id:employeeId}], function(err, res){
                        if (err) throw err;
                        console.log("employee updated");
                        startQ();
                    })
                })
                .catch(err => {
                    if (err) throw err;
                });
        })
    })
}

//asks which employee and the manager they will be assigned to, then updates the employee 
function updateManager(){
    connection.query(queryList.managerList, function(err, res){
        if (err) throw err;
        let employeeList = res;
        let employeeNames = employeeList.map(e => e.name)
        inquirer
            .prompt([new q.queryAdd('employee', 'Which employee did you want to update?', employeeNames)])
            .then(answer => {
                let employee = answer.employee
                let newEmployeeNames = employeeNames.filter(e => e != answer.employee).push("none");
                inquirer
                    .prompt([new q.queryAdd('manager', 'Which manager will this employee assigned', newEmployeeNames)])
                    .then(answer => {
                        let employeeId = employeeList.filter(e => e.name === employee).map(id => id.id);
                        let managerId = employeeList.filter(e => e.name === answer.manager).map(id => id.id).shift();
                        if (!managerId) managerId = null;
                        connection.query(queryList.updateEmployee, 
                            [{manager_id:managerId},{id:employeeId}], 
                            function(err, res){
                                if (err) throw err;
                                console.log("manager updated");
                                startQ();
                        });
                    })
                    .catch(err => {
                        if (err) throw err;
                    });
                })
                .catch(err => {
                    if (err) throw err;
                });
            });
            
}

//returns a list of roles
function viewRoles(){
    connection.query(queryList.roleListDept, function(err, res){
        if(err) throw err;
        console.table(res);
        startQ();
    })
}

//returns a list of departments
function viewDepartments(){
    connection.query(queryList.deptList, function(err, res){
        if(err) throw err;
        console.table(res);
        startQ();
    })

}

//BONUS:
function viewBudget(){
    console.log("hahahahahaha")
    startQ();
}

//ends the server connection
function quit(){
    connection.end();
}