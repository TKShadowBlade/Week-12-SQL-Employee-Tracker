const connection = require('./connection');

class Database {
    constructor(connection) {
        this.connection = connection;
    }

    getAllEmployees() {
        return this.connection.promise().query(
            `SELECT employee.id AS ID, employee.first_name, employee.last_name, role.title, role.salary, manager.last_name AS Manager, department.name AS department
        FROM employee 
            LEFT JOIN employee manager
                ON manager.id = employee.manager_id
            LEFT JOIN role
                ON employee.role_id = role.id
            LEFT JOIN department
                ON role.department_id = department.id`
        );
    }

    addEmployee(employee) {
        return this.connection.promise().query('INSERT INTO employee SET ?', employee);
    }

    getAllDepartments() {
        return this.connection.promise().query(
        'SELECT department.id AS ID, department.name FROM department;'
        );
    }

    addDepartment(department) {
        return this.connection.promise().query(
            'INSERT INTO department SET name=?', department
        );
    }

    getAllRoles() {
        return this.connection.promise().query(
           'SELECT role.id AS ID, role.title AS title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;' 
        );
    }

    addRole(role) {
        return this.connection.promise().query(
            'INSERT INTO role SET ?', role
        );
    }

    updateRole(employeeId, roleId) {
        return this.connection.promise().query(
            'UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]
        );
    }
}

module.exports = new Database(connection);