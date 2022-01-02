const connection = require('./connection');

class Database {
    constructor(connection) {
        this.connection = connection;
    }

    getAllEmployees() {
        return this.connection.promise().query(
            `SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS title, r.salary AS Salary, m.last_name AS Manager, d.name AS Department
        FROM employee e 
            LEFT JOIN employee m
                ON e.manager_id = m.id
            LEFT JOIN role r
                ON e.role_id = r.title
            LEFT JOIN department d
                ON r.department_id - d.id`
        );
    }

    addEmployee(employee) {
        return this.connection.promise().query('INSERT INTO employee SET ?', employee);
    }

    getAllDepartments() {
        return this.connection.promise().query(
        'SELECT d.id AS ID, d.name AS Department Name FROM department;'
        );
    }

    addDepartment(department) {
        return this.connection.promise().query(
            'INSERT INTO department SET ?', department
        );
    }

    getAllRoles() {
        return this.connections.promise().query(
           'SELECT r.id AS ID, r.title AS title, d.name AS department, r.salary FROM role LEFT JOIN department on r.department_id = d.id;' 
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