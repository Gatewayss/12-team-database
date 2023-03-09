use team_db;

INSERT INTO department (name)
VALUES ('Sales'), ('Marketing'), ('Engineering');

INSERT INTO
    role (title, salary, department_id)
VALUES ('Marketing Manager', 7000.00, 2), ('Software Engineer', 8000.00, 3), ('Financial Analyst', 6000.00, 1);

INSERT INTO
    employee (
        first_name,
        last_name,
        role_id,
        manager_id
    )
VALUES ('John', 'Coolguy', 1, NULL), ('Mary', 'Norton', 3, 2), ('Bob', 'Awesome', 2, 1);