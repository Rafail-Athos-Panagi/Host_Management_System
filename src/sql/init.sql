CREATE DATABASE IF NOT EXISTS host_management_system;
USE host_management_system;

CREATE TABLE IF NOT EXISTS users(
    `userID` INT AUTO_INCREMENT,
    `username` varchar(15) NOT NULL,
    `password` varchar(256) NOT NULL,
    `email` varchar(50) NOT NULL UNIQUE,
    `deleted` boolean NOT NULL DEFAULT 0,
    PRIMARY KEY (`userID`),
    CONSTRAINT CHK_username UNIQUE (`username`),
    CONSTRAINT CHK_name CHECK (CHAR_LENGTH(`username`) >= 5)
);

CREATE TABLE IF NOT EXISTS suppliers(
	`supplierID` int NOT NULL AUTO_INCREMENT,
    `supplierName` varchar(50) NOT NULL,
    `supplierEmail` varchar(50) NOT NULL,
    `phoneNumber` int NOT NULL,
    `supplierStreetName` varchar(40),
    `supplierStreetNumber` int,
	`supplierCity` varchar(15),
    `supplierPostalCode` int,
    `deleted` boolean NOT NULL DEFAULT 0,
    PRIMARY KEY (`supplierID`),
    CONSTRAINT CHK_supplier_email CHECK (`supplierEmail` like '%@%.%')
);

CREATE TABLE IF NOT EXISTS supplier_products(
	`supplierID` int NOT NULL,
    `productName` varchar(50) NOT NULL,
    `price` float,
    `productUnit` varchar(10),
    `deleted` boolean NOT NULL DEFAULT 0,
    PRIMARY KEY (`supplierID`,`productName`),
    FOREIGN KEY (`supplierID`) REFERENCES suppliers(`supplierID`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipes(
    `recipeID` int NOT NULL AUTO_INCREMENT,
	`recipeName` varchar(50) NOT NULL,
    `recipeImage` varchar(100),
    `recipeDescription` tinytext,
    `recipeProcedure` text,
    `recipeIngredients` text,
    `recipeDate` varchar(40),
    `recipeTools` tinytext,
    `recipeYield` tinytext,
    `recipePortion` tinytext,
    `recipeShelfLife` tinytext,
    `recipeSensitivity` tinytext,
    `recipeRemarks` tinytext,
    `deleted` boolean NOT NULL DEFAULT 0,
    PRIMARY KEY (`recipeID`)
);

CREATE TABLE IF NOT EXISTS stock(
	`stockProductID` int NOT NULL AUTO_INCREMENT,
    `barcode` varchar(50) NOT NULL,
	`stockName` varchar(50) NOT NULL,
    `stockType` varchar(50),
    `stockUnit` varchar(10),
    `stockQuantity` float NOT NULL,
    `supplierID` int NOT NULL,
    `description` varchar(50),
    `deleted` boolean NOT NULL DEFAULT 0,
    PRIMARY KEY (`stockProductID`),
    CONSTRAINT CHK_Barcode UNIQUE(`barcode`),
    FOREIGN KEY (`supplierID`) REFERENCES suppliers(`supplierID`)
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS staff(
	`staffID` int NOT NULL AUTO_INCREMENT,
    `staffName` varchar(50) NOT NULL,
    `staffSurname` varchar(50) NOT NULL,
    `staffPhoneNumber` int,
    `staffEmail` varchar(50),
    `staffDateOfBirth` date,
    `staffIDNumber` varchar(15),
    `staffSocialSecurityNumber` varchar(10),
	`staffStreetNumber` int,
    `staffStreetName` varchar(40),
    `staffCity` varchar(15),
    `staffPostalCode` int,
    `startDate` date,
    `endDate` date,
    `deleted` boolean NOT NULL DEFAULT 0,
    PRIMARY KEY (`staffID`),
    CONSTRAINT CHK_staff_name CHECK (CHAR_LENGTH(`staffName`) > 0),
    CONSTRAINT CHK_staff_surname CHECK (CHAR_LENGTH(`staffSurname`) >0),
    CONSTRAINT CHK_staff_email CHECK (`staffEmail` like '%@%.%')
);

CREATE TABLE IF NOT EXISTS orders(
    `orderID` int NOT NULL AUTO_INCREMENT,
    `supplierID` int NOT NULL,
    `orderstatus` varchar(10),
    `orderTotalPrice` int,
    `orderInvoice` tinytext,
    `orderDate` datetime,
    `arrivalDate` datetime,
    `comments` tinytext,
    PRIMARY KEY (`orderID`),
    FOREIGN KEY (`supplierID`) REFERENCES suppliers(`supplierID`)
);

CREATE TABLE IF NOT EXISTS order_details(
    `orderID` int NOT NULL,
    `orderQuantity` int NOT NULL,
    `orderProductPrice` int NOT NULL,
    `orderProductName` varchar(50) NOT NULL,
    FOREIGN KEY (`orderID`) REFERENCES orders(`orderID`)
);

CREATE TABLE IF NOT EXISTS productTypesVariables(
	`productTypeID` int NOT NULL AUTO_INCREMENT,
	`productType` varchar(25),
    PRIMARY KEY(`productTypeID`)
);

CREATE TABLE IF NOT EXISTS todolist(
	`todoID` int NOT NULL AUTO_INCREMENT,
    `description` tinytext,
    `dueDate` date,
    `byWho` varchar(30),
    `forWho` varchar(30),
    `completed` boolean NOT NULL DEFAULT 0,
    PRIMARY KEY(`todoID`)
);

CREATE TABLE IF NOT EXISTS unitsVariables(
	`unitTypeID` int NOT NULL AUTO_INCREMENT,
	`unitType` varchar(20),
    PRIMARY KEY(`unitTypeID`)
);

CREATE TABLE IF NOT EXISTS `logs`(
	`event` int NOT NULL AUTO_INCREMENT,
    `username` varchar(20),
    `action` varchar(10),
    `ID` int,
    `table` varchar(20),
    `description` tinytext,
    `date` varchar(40),
    PRIMARY KEY(`event`),
    FOREIGN KEY (`username`) REFERENCES users(`username`)
);

/* CREATE TABLE IF NOT EXISTS `shift_scheduling` (
	`id` int NOT NULL,
	`title` varchar(50) NOT NULL,
    `startDate` DATETIME NOT NULL,
    `endDate` DATETIME NOT NULL,
    `notes` varchar(100) NOT NULL,
   `deleted` boolean NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`) 
);*/

CREATE TABLE IF NOT EXISTS `shift_scheduling` (
    `staffID` INT NOT NULL,
    `staffName` varchar(50) NOT NULL,
    `staffSurname` varchar(50) NOT NULL,
    `monday` varchar(50) DEFAULT NULL,
    `tuesday` varchar(50) DEFAULT NULL,
    `wednesday` varchar(50) DEFAULT NULL,
    `thursday` varchar(50) DEFAULT NULL,
    `friday` varchar(50) DEFAULT NULL,
    `saturday` varchar(50) DEFAULT NULL,
    `sunday` varchar(50) DEFAULT NULL,
    `week` varchar(2) DEFAULT NULL UNIQUE,
    FOREIGN KEY (`staffID`) REFERENCES staff(`staffID`)
    ON DELETE CASCADE
);
