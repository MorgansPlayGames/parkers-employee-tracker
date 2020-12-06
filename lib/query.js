

const employeeList = "SELECT first_name, last_name, title, salary, name as department_name FROM employee LEFT JOIN role ON role_id = role.id LEFT JOIN department ON department_id = department.id";

const employeesByManager = "SELECT t.first_name, t.last_name, e.first_name as manager_name, e.last_name as manager_surname FROM employee as t LEFT JOIN employee as e ON t.manager_id = e.id";

const deptList = "SELECT name, id FROM department";
const roleList = "SELECT title, id, department_id FROM role"; 
const managerList = "SELECT CONCAT (first_name, ' ' , last_name) AS name, id FROM employee"
const postEmployee = "INSERT INTO employee SET ?"
const roleListDept = "SELECT title, salary, name AS department_name FROM role LEFT JOIN department ON department_id = department.id"; 



const queryList = {
    employeeList:employeeList,
    employeesByManager:employeesByManager,
    deptList:deptList,
    roleList:roleList,
    managerList:managerList,
    postEmployee:postEmployee,
    roleListDept:roleListDept
}


module.exports = queryList;