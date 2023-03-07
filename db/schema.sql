CREATE DATABASE team_db;

use team_db;

CREATE TABLE
    department (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30) NOT NULL
    );

CREATE TABLE
    role (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(30) NOT NULL,
        salary DECIMAL NOT NULL,
        department_id INT,
        FOREIGN KEY (department_id) REFERENCES department(id)
    );

CREATE TABLE
    employee (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        first_name NOT NULL VARCHAR(30),
        last_name NOT NULL VARCHAR(30),
        manager_id INT,
        FOREIGN KEY (role_id) REFERENCES role(id),
        FOREIGN KEY (manager_id) REFERENCES employee(id)
    );

CREATE TABLE
    employee (
        id INT PRIMARY KEY,
        first_name VARCHAR(30),
        last_name VARCHAR(30),
        role_id INT,
        manager_id INT,
        FOREIGN KEY (role_id) REFERENCES role(id),
        FOREIGN KEY (manager_id) REFERENCES employee(id)
    );