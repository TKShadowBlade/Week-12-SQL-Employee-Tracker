// Required dependencies
const connection = require ("./connection");
const inquirer = require ("inquirer");
const db = require('./Content/database');

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
            .then(() => console.log(`${answer} added successfully`))
            .then(() => startUp());
                })
        }

function addRole() {
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
                type: 'number',
                message: 'Input department ID here',
                validate: (value) => {
                    if(isNaN(value) === false) {
                        return true;
                    }
                    return false;
                    }
            }
        ]).then((answer) => {
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.role,
                    salary: answer.salary,
                    department_id: answer.department_id
                },
                (err) => {
                    if(err) throw err;
                    console.log ('Updated successfully');
                    startUp();
                }
            )
        })
}

function addEmployee() {
    connection.query ('SELECT * FROM role', (err, res) => {
        if(err) throw err;
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
            },
            {
                name: 'role',
                type: 'rawlist',
                choices: function() {
                    const choiceArray = [];
                    for (i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].title)
                    }
                    return choiceArray;
                },
                message: 'Choose a title:'
            },
            {
                name: 'manager',
                type: 'number',
                validate: (value) => {
                    if(isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },
                message: 'Input manager ID here:',
                default: '1'
            }
        ]).then ((answer) => {
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.role,
                    manager_id: answer.manager
                }
            )
            console.log ("Succesful Add");
            startUp()
        });
    });
}

function updateEmployee(){
    connection.query ('SELECT * FROM employee',
    (err, res) => {
        if(err) throw err;
        inquirer
            .prompt([
                {
                    name: 'choice',
                    type: 'rawlist',
                    choices: () => {
                        const choiceArray = [];
                        for (i = 0; i < res.length; i++)
                        {choiceArray.push(res[i].last_name)}
                        return choiceArray;
                    },
                    message: 'Which employee would you like to update?'
                }
            ]).then((answer) => {
                const chosenName = answer.choice;

                connection.query('SELECT * FROM employee',
                (err, res) => {
                    if(err) throw err;
                    inquirer
                    .prompt([
                        {
                            name: 'role',
                            type: 'rawlist',
                            choices: () => {
                                const choiceArray = [];
                                for (i = 0; i , res.length; i++) {
                                    choiceArray.push(res[i].role_id)
                                }
                                return choiceArray;
                            },
                            message: 'Please choose a title'
                        },
                        {
                            name: 'manager',
                            type: 'number',
                            validate: (value) => {
                                if(isNaN(value) === false) {
                                    return true;
                                }
                                return false;
                            },
                            message: 'Please input new manager ID',
                            default: '1'
                        }
                    ]).then ((answer) => {
                        connection.query ('UPDATE employee SET ? WHERE last_name= ?',
                        [
                            {
                                role_id: answer.role,
                                manager_id: answer.manager
                            }, chosenName
                        ]),
                        console.log ('Update successful');
                        startUp();
                    })
                })
            })
    })
}