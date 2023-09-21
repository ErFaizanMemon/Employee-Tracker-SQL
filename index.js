// Import required libraries and modules
const mysql = require('mysql2');
const inquirer = require('inquirer');
//const config = require('./package.json');

// Create a database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Faizan013',
  database: 'employees_db',
});

connection.connect(function(err){
  if(err) throw err;
  startApp()
})

// Define questions for the main menu
const menuQuestions = [
  {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'View All Roles',
      'View All Departments',
      'Add Employee',
      'Add Role',
      'Add Department',
      'Update Employee Role',
      'QUIT',
    ],
  },
];

// Function to start the application
function startApp() {
  inquirer.prompt(menuQuestions)
    .then((response) => {
      switch (response.action) {
        
        // Handle different menu options
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'QUIT':
          process.exit();
          
        default:
          console.log('Invalid option. Please try again.');
          startApp();
          break;
      }
    })
    .catch((err) => {
      //console.error(err);
    });
}

// Start the application
//startApp();

// Function to view all employees
function viewAllEmployees() {
  connection.query('SELECT * FROM employee', function (error, data) {
    if (error) {
      console.error(error);
    } else {
      console.table(data);
      startApp();
    }
  });
}

// Function to view all roles
function viewAllRoles() {
  connection.query('SELECT * FROM role', function (error, data) {
    if (error) {
      console.error(error);
    } else {
      console.table(data);
      startApp();
    }
  });
}

// Function to view all departments
function viewAllDepartments() {
  connection.query('SELECT * FROM department', function (error, data) {
    if (error) {
      console.error(error);
    } else {
      console.table(data);
      startApp();
    }
  });
}

// Function to add an employee
function addEmployee() {
  connection.query('SELECT * FROM role', function (error, roles) {
    if (error) {
      console.error(error);
    } else {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the new employee:',
          },
          {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the new employee:',
          },
          {
            type: 'list',
            name: 'role_id',
            choices: roles.map((role) => role.title),
            message: 'Select the role for the new employee:',
            filter: function (choice) {
              return roles.find((role) => role.title === choice).id;
            },
          },
          {
            type: 'input',
            name: 'manager_id',
            message: "Enter the manager's ID for the new employee (or 'NONE' if none):",
            filter: function (choice) {
              if (choice.toUpperCase() === 'NONE') {
                return null;
              } else return choice;
            },
          },
        ])
        .then(function (res) {
          const employeeData = {
            manager_id: res.manager_id,
            first_name: res.first_name,
            last_name: res.last_name,
            role_id: res.role_id,
          };
          connection.query(
            'INSERT INTO employee SET ?',
            employeeData,
            function (error, data) {
              if (error) {
                console.error(error);
              } else {
                console.log('Employee added successfully.');
                startApp();
              }
            }
          );
        });
    }
  });
}

// Function to add a role
function addRole() {
  connection.query('SELECT * FROM department', function (error, departments) {
    if (error) {
      console.error(error);
    } else {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'roleTitle',
            message: 'Enter the title of the new role:',
          },
          {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter the salary for the new role:',
          },
          {
            type: 'list',
            name: 'roleDepartment',
            choices: departments.map((department) => department.name),
            message: 'Select the department for the new role:',
            filter: function (choice) {
              return departments.find((department) => department.name === choice).id;
            },
          },
        ])
        .then(function (res) {
          const roleData = {
            title: res.roleTitle,
            salary: res.roleSalary,
            department_id: res.roleDepartment,
          };
          connection.query(
            'INSERT INTO role SET ?',
            roleData,
            function (error, data) {
              if (error) {
                console.error(error);
              } else {
                console.log('Role added successfully.');
                startApp();
              }
            }
          );
        });
    }
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the new department:',
      },
    ])
    .then(function (res) {
      connection.query(
        'INSERT INTO department (name) VALUES (?)',
        [res.departmentName],
        function (error, data) {
          if (error) {
            console.error(error);
          } else {
            console.log('Department added successfully.');
            startApp();
          }
        }
      );
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'empid',
        message: 'Enter the employee ID you want to update:',
      },
      {
        type: 'input',
        name: 'roleid',
        message: 'Enter the new role ID for the employee:',
      },
    ])
    .then(function (res) {
      connection.query(
        'UPDATE employee SET role_id = ? WHERE id = ?',
        [res.roleid, res.empid],
        function (error, data) {
          if (error) {
            console.error(error);
          } else {
            console.log('Employee role updated successfully.');
            startApp();
          }
        }
      );
    });
}
