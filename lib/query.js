

const employeeList = "SELECT first_name, last_name, title, salary, name as department_name FROM employee LEFT JOIN role ON role_id = role.id LEFT JOIN department ON department_id = department.id";
const employeesByManager = "SELECT t.first_name, t.last_name, e.first_name as manager_name, e.last_name as manager_surname FROM employee as t LEFT JOIN employee as e ON t.manager_id = e.id";
const deptList = "SELECT name, id FROM department";
const roleList = "SELECT title, id FROM role";

const queryList = {
    employeeList:employeeList,
    employeesByManager:employeesByManager,
    deptList:deptList,
    roleList:roleList
}

module.exports = queryList;