


const homeBase = {
    type:'list',
    name:'homeBase',
    message:'Options:',
    choices:['view all employees', 'view all employees by department',
            'view all employees by manager', 'add employee', 'add department',
            'add role', 'remove employee', 'remove department', 'remove role',
            'update employee role', 'update employee manager', 'update employee department', 
            'view all roles', 'view all departments', 'view budget', 'quit']
}

const addDepartment = {
    type:'input',
    name:'departmentName',
    message:"What is the new department's name?"
}

const addEmployee = [{
    type:'input',
    name:'firstName',
    message:'What is the first name of the employee?'
},
{
    type:'input',
    name:'lastName',
    message:'What is the last name of the employee?'
}]

class queryAdd {
    constructor(name, message, choices){
        this.type = 'list';
        this.name = name;
        this.message = message;
        this.choices = choices;
    }
}

const q = {
    homeBase:homeBase, 
    addDepartment:addDepartment,
    addEmployee:addEmployee,
    queryAdd
};

module.exports = q;