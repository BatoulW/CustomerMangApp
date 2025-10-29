CREATE DATABASE CustMang;
GO

USE CustMang;
GO

CREATE TABLE Customer (
CustomerId			INT PRIMARY KEY IDENTITY(1,1),
CustomerName		NVARCHAR(50) NOT NULL,
Email				VARCHAR(100) NOT NULL,
IsActive			BIT DEFAULT 1,
CreatedAt			DATETIME2
);
GO

CREATE TABLE Orders (
OrderId				INT PRIMARY KEY IDENTITY(1,1),
OrderDesc			NVARCHAR(100)	NOT NULL,
Amount				INT				NOT NULL,
CreatedAt			DATETIME2,
CustomerId			INT				NOT NULL
);
GO
ALTER TABLE Orders ADD CONSTRAINT Fk_CustomerId FOREIGN KEY (CustomerId) REFERENCES Customer (CustomerId)  ON DELETE CASCADE;
GO

