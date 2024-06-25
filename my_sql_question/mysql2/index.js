// Create an Express.js application that performs the following operations on a products table in a MySQL database:

// Fetch all products: Implement an endpoint to retrieve all products from the products table.
// Fetch a product by ID: Implement an endpoint to retrieve a specific product by its id.
// Add a new product: Implement an endpoint to add a new product to the products table.

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
  });
});

// Fetch all products
app.get('/products', (req, res) => {
  const selectAllQuery = 'SELECT * FROM products';
  connection.query(selectAllQuery, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Fetch a product by ID
app.get('/products/:id', (req, res) => {
  const selectByIdQuery = 'SELECT * FROM products WHERE id = ?';
  connection.query(selectByIdQuery, [req.params.id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// Add a new product
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  const insertQuery = 'INSERT INTO products (name, price) VALUES (?, ?)';
  connection.query(insertQuery, [name, price], (err, results) => {
    if (err) throw err;
    res.json({ id: results.insertId, name, price });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
