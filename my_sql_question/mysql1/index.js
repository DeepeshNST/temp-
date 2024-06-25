// Question:

// Create a Node.js application using Express.js that seeds a users table in a MySQL database. The users table should have the following columns:

// id (Primary Key, Auto Increment)
// name (VARCHAR(255))
// email (VARCHAR(255), Unique)

const express = require('express');
const mysql = require('mysql2');
const app = express();

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Da.2>RL2%OpE',
    database: 'testdb'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');

    // Create users table
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL
    )
  `;
    connection.query(createTableQuery, (err, results) => {
        if (err) throw err;
        console.log('Users table created');

        // Seed data
        const seedDataQuery = `
      INSERT INTO users (name, email)
      VALUES 
        ('John Doe', 'john@example.com'),
        ('Jane Smith', 'jane@example.com'),
        ('Alice Johnson', 'alice@example.com')
    `;
        connection.query(seedDataQuery, (err, results) => {
            if (err) throw err;
            console.log('Users table seeded');
        });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
