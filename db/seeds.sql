use team_db;

INSERT INTO department (name)
VALUES ('Sales'), ('Marketing'), ('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES ('job', 3000.00, 1);