use team_db;

INSERT INTO department (name)
VALUES ('Sales'), ('Marketing'), ('Engineering');

INSERT INTO
    role (title, salary, department_id)
VALUES ('job', 3000.00, 1), ('host', 5454.00, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('John', 'coolguy', 1);