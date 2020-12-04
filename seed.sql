DROP DATABASE employeeDB;
CREATE DATABASE employeeDB;

USE employeeDB
CREATE TABLE employee_table(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role_table (id),
    FOREIGN KEY (manager_id) REFERENCES employee_table (id)
)

CREATE TABLE role_table (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL, 
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department_table (id)
)

CREATE TABLE department_table (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
)

INSERT INTO department_table (name)
VALUES  ("Adventurers"),
        ("Theives Guild"),
        ("Nobility");

INSERT INTO role_table (title, salary, department_id)
VALUES 
("Paladin", 10, 2),
("Barbarian", 1, 0),
("Bard", 30, 2),
("Rogue", 10, 1),
("Sorcerer", 10, 0),
("Warlock", 15, 1),
("Wizard", 30, 2),
("Druic", 5, 0),
("Monk", 5, 1),
("Fighter", 10, 0),
("Ranger", 10, 1);

INSERT INTO employee_table(first_name, last_name, role_id, manager_id)
VALUES 
("Fredrick", "Firegut", 8, NULL),
("Holy", "Lothar", 0, 0),
("Bruticus", "The Bloody", 1, 0),
("Taleweaver", "Drimmithoy", 2, 0),
("Sneaks", "Around", 3, 0),
("Power", "Overwhelming", 4, 0),
("Unholy", "Bothar", 5, 0),
("Percious", "Bookwatcher", 6, 0),
("Tree", "Stick", 7, 0),
("Private", "Ryan", 9, 0),
("Legolas", "The Elf", 10, 0),