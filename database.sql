IF DB_ID(N'quanlysinhvien') IS NULL
BEGIN
    CREATE DATABASE quanlysinhvien;
END
GO

USE quanlysinhvien;
GO

IF OBJECT_ID(N'dbo.students', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.students (
        id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_students PRIMARY KEY,
        student_code NVARCHAR(20) NOT NULL CONSTRAINT UQ_students_student_code UNIQUE,
        full_name NVARCHAR(100) NOT NULL,
        email NVARCHAR(150) NULL,
        phone NVARCHAR(20) NULL,
        class_name NVARCHAR(50) NULL
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.students)
BEGIN
    INSERT INTO dbo.students (id, student_code, full_name, email, phone, class_name)
    VALUES
        ('5b599794-18e8-4a45-a6c2-755dcaf3881a', N'SV001', N'Nguyen Van A', 'a@gmail.com', '0901234567', 'C2024A'),
        ('422ff893-970a-47b5-b0b3-950bd08cc96b', N'SV002', N'Tran Thi B', 'b@gmail.com', '0912345678', 'C2024B'),
        ('49c77b9e-e56b-49a3-b89d-a2fb6b578c02', N'SV003', N'Le Hoang C', 'c@gmail.com', '0923456789', 'C2024C');
END
GO
