// Required dependencies
const inquirer = require ("inquirer");
const db = require('./database')
require('console.table');

startUp();

function startUp() {
    inquirer
        .prompt([
            {
            type: 'list',
            name: 'begin',
            message: 'Which of the following would you like to do first?',
            choices: ['View', 'Add', 'Update', 'Quit']
            }
        ]).then((res) => {
            switch(res.begin){
                case 'View':
                    view();
                    break;
                case 'Add':
                    add();
                    break;
                case 'Update':
                    updateEmployee();
                    break;
                case 'Quit':
                    console.log ('Completed');
                    quit();
                default:
                    console.log ('Thank you for your attention')
            }
        });
}

function view() {
    inquirer
        .prompt ([
            {
            type: 'list',
            name: 'view',
            message: 'Which would you like to view?',
            choices: ['All employees', 'All departments', 'All roles']
            }
        ]).then((res) => {
            switch (res.view) {
                case 'All employees':
                    viewAllEmployees();
                    break;
                case 'All departments':
                    viewAllDepartments();
                    break;
                case 'All roles':
                    viewAllRoles();
                default:
                    console.log('Thank you');
            }
        });
}

function viewAllEmployees() {
    db.getAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        console.table(employees);
    })
    .then(() => startUp());
}

function viewAllDepartments() {
    db.getAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        console.table(departments);
    })
    .then(() => startUp());
}

function viewAllRoles() {
    db.getAllRoles()
    .then(([rows]) => {
        let roles = rows;
        console.table(roles);
    })
    .then(() => startUp());
}

function add() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'add',
                message: 'Choose which you would like to add:',
                choices: ['Department', 'Role', 'Employee']
            }
        ]).then((res) => {
            switch(res.add){
                case 'Department':
                    addDepartment();
                    break;
                case 'Role':
                    addRole();
                    break;
                case 'Employee':
                    addEmployee();
                    break;
                default:
                    console.log('Thank you for your choice')
            }
        })
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: 'department',
                type: 'input',
                message: 'Type the name of the department you wish to add:'
            }
        ]).then((answer) => {
            db.addDepartment(answer)
            .then(() => console.log(`Department added successfully`))
            .then(() => startUp());
                })
        }

function addRole() {
    db.getAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        const deptChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));
    })
    
    inquirer
        .prompt([
            {
                name: 'role',
                type: 'input',
                message: 'Type in the role you would like to add:'
            },
            {
                name: 'salary',
                type: 'number',
                message: 'Input salary here:',
                validate: (value) => {
                    if(isNaN(value) === false) {
                        return true;
                    }
                    return false;
                    }
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department for your role',
                choices: deptChoices
            }
        ]).then((answer) => {
            db.addRole(answer)
            .then(() => console.log('Role added successfully'))
            .then(() => startUp())
        })
}

function addEmployee() {
      inquirer
        .prompt([
            {
                name: 'first',
                type: 'input',
                message: 'Input employee first name here:'
            },
            {
                name: 'last',
                type: 'input',
                message: 'Input employee last name here:'
            }
        ]).then(answer => {
            let firstName = answer.first;
            let lastName = answer.last;

            db.getAllRoles()
            .then(([rows]) => {
                let roles = rows;
                const roleList = roles.map(({ id, title }) => ({
                    name: title,
                    value: id
                }));

                inquirer.prompt({
                    name: 'roleId',
                    type: 'list',
                    message: 'Select employee role',
                    choices: roleList
                })
                .then(answer => {
                    let roleId = answer.roleId;

                    db.getAllEmployees()
                    .then(([rows]) => {
                        let employees = rows;
                        const managerList = employees.map(({ id, first, last}) => ({
                            name: `${first} ${last}`,
                            value: id
                        }));

                        managerList.unshift({ name: 'None', value: null});

                        inquirer.prompt({
                            name: 'managerId',
                            type: 'list',
                            message: 'Select the manager for your employee',
                            choices: managerList
                        })
                        .then(answer => {
                            let employee = {
                                manager_id: answer.managerId,
                                role_id: roleId,
                                first: firstName,
                                last: lastName
                            }

                            db.addEmployee(employee);
                        })
                        .then(() => console.log ('New employee added successfully'))
                        .then(() => startUp())
                    })
                })
            })
        })


    }


function updateEmployee(){
    db.updateRole()
        .then(([rows]) => {
            let employees = rows;
            const empChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

        inquirer
            .prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    choices: empChoices,
                    message: 'Choose the employee you would like to update:'
                }
            ]).then((answer) => {
                let employeeId = answer.employeeId;
                db.getAllRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));

                    inquirer.prompt([
                        {
                            name: 'roleId',
                            type: 'list',
                            message: 'Choose the role to assign to your employee:',
                            choices: roleChoices
                        }
                    ])
                    .then(answer => db.updateRole(employeeId, answer.roleId))
                    .then(() => console.log ('Updated employee successfully'))
                    .then(() => startUp())
                });
            });
        });
    }

function quit() {
    console.log('Thank you!');
    process.exit();
}