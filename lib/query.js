

const employeeList = "SELECT first_name, last_name, title, salary, name as department_name FROM employee LEFT JOIN role ON role_id = role.id LEFT JOIN department ON department_id = department.id";

const employeesByManager = "SELECT t.first_name, t.last_name, e.first_name as manager_name, e.last_name as manager_surname FROM employee as t LEFT JOIN employee as e ON t.manager_id = e.id";

const employeeRole = "SELECT e.id role_id"

const deptList = "SELECT name, id FROM department";
const roleList = "SELECT title, id, department_id FROM role"; 
const managerList = "SELECT CONCAT (first_name, ' ' , last_name) AS name, id FROM employee"
const roleListDept = "SELECT r.title, r.salary, r.id, name AS department_name FROM role AS r LEFT JOIN department ON department_id = department.id"; 

const deleteEmployee = "DELETE FROM employee WHERE ?"
const deleteEmployees = "DELETE FROM employee WHERE role_id IN ("
const deleteRole = "DELETE FROM role WHERE ?"
const deleteRoles = "DELETE FROM role WHERE id IN ("
const deleteDepartment = "DELETE FROM department WHERE ?"

const postEmployee = "INSERT INTO employee SET ?"
const postRole = "INSERT INTO role SET ?"
const postDepartment = "INSERT INTO department SET ?"

const updateEmployeeRole = "UPDATE employee SET ?"


const queryList = {
    employeeList:employeeList,
    employeesByManager:employeesByManager,
    deptList:deptList,
    roleList:roleList,
    managerList:managerList,
    postEmployee:postEmployee,
    roleListDept:roleListDept,
    deleteEmployee:deleteEmployee,
    deleteEmployees:deleteEmployees,
    deleteRole:deleteRole,
    deleteRoles:deleteRoles,
    deleteDepartment:deleteDepartment,
    employeeRole:employeeRole,
    postRole:postRole,
    postDepartment:postDepartment,
    updateEmployeeRole:updateEmployeeRole
}


module.exports = queryList;