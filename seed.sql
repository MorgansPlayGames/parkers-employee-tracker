DROP DATABASE employeeDB;
CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL, 
    department_id INT,
    
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);

INSERT INTO department (name)
VALUES  
("Adventurers"),
("Theives Guild"),
("Nobility");

INSERT INTO role (title, salary, department_id)
VALUES 
("Paladin", 10, 3),
("Barbarian", 1, 1),
("Bard", 30, 3),
("Rogue", 10, 2),
("Sorcerer", 10, 1),
("Warlock", 15, 2),
("Wizard", 30, 3),
("Druic", 5, 1),
("Monk", 5, 2),
("Fighter", 10, 1),
("Ranger", 10, 2);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES 
("Fredrick", "Firegut", 9, NULL),
("Holy", "Lothar", 1, 1),
("Bruticus", "The Bloody", 2, 1),
("Taleweaver", "Drimmithoy", 3, 1),
("Sneaks", "Around", 4, 1),
("Power", "Overwhelming", 5, 1),
("Unholy", "Bothar", 6, 1),
("Percious", "Bookwatcher", 7, 1),
("Tree", "Stick", 8, 1),
("Private", "Ryan", 10, 1),
("Legolas", "The Elf", 11, 1);