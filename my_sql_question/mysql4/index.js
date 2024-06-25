// Create an Express.js application that retrieves paginated data from a products table in a MySQL database. Implement the following functionalities:

// Fetch paginated products: Implement an endpoint to retrieve products with pagination. The endpoint should accept page and limit as query parameters.
// Create and seed the products table: The table should have the following columns:
// id (Primary Key, Auto Increment)
// name (VARCHAR(255))
// price (DECIMAL(10, 2))
// Seed the table with at least 50 products.


const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

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

    // Create products table
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL
    )
  `;
  
    connection.query(createTableQuery, (err, results) => {
        if (err) throw err;
        console.log('Products table created');

        // Seed data
        const seedDataQuery = `
      INSERT INTO products (name, price)
      VALUES 
        ('Product 1', 10.00),
        ('Product 2', 20.00),
        ('Product 3', 30.00),
        ('Product 4', 40.00),
        ('Product 5', 50.00),
        ('Product 6', 60.00),
        ('Product 7', 70.00),
        ('Product 8', 80.00),
        ('Product 9', 90.00),
        ('Product 10', 100.00),
        ('Product 11', 110.00),
        ('Product 12', 120.00),
        ('Product 13', 130.00),
        ('Product 14', 140.00),
        ('Product 15', 150.00),
        ('Product 16', 160.00),
        ('Product 17', 170.00),
        ('Product 18', 180.00),
        ('Product 19', 190.00),
        ('Product 20', 200.00),
        ('Product 21', 210.00),
        ('Product 22', 220.00),
        ('Product 23', 230.00),
        ('Product 24', 240.00),
        ('Product 25', 250.00),
        ('Product 26', 260.00),
        ('Product 27', 270.00),
        ('Product 28', 280.00),
        ('Product 29', 290.00),
        ('Product 30', 300.00),
        ('Product 31', 310.00),
        ('Product 32', 320.00),
        ('Product 33', 330.00),
        ('Product 34', 340.00),
        ('Product 35', 350.00),
        ('Product 36', 360.00),
        ('Product 37', 370.00),
        ('Product 38', 380.00),
        ('Product 39', 390.00),
        ('Product 40', 400.00),
        ('Product 41', 410.00),
        ('Product 42', 420.00),
        ('Product 43', 430.00),
        ('Product 44', 440.00),
        ('Product 45', 450.00),
        ('Product 46', 460.00),
        ('Product 47', 470.00),
        ('Product 48', 480.00),
        ('Product 49', 490.00),
        ('Product 50', 500.00)
    `;
        connection.query(seedDataQuery, (err, results) => {
            if (err) throw err;
            console.log('Products table seeded');
        });
    });
});

// Fetch paginated products
app.get('/products', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const paginatedQuery = 'SELECT * FROM products LIMIT ? OFFSET ?';
    connection.query(paginatedQuery, [limit, offset], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
