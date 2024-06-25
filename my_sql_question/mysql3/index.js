// Create an Express.js application that performs the following operations on a products table in a MySQL database:

// Delete a product by ID: Implement an endpoint to delete a specific product by its id.
// Update a product completely: Implement an endpoint to update all details of a product by its id.
// Update a product partially: Implement an endpoint to update some details of a product by its id.


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
        ('Product 3', 30.00)
    `;
    connection.query(seedDataQuery, (err, results) => {
      if (err) throw err;
      console.log('Products table seeded');
    });
  });
});

// Update a product completely (PUT)
app.put('/products/:id', (req, res) => {
    const { name, price } = req.body;
    const updateQuery = 'UPDATE products SET name = ?, price = ? WHERE id = ?';
    connection.query(updateQuery, [name, price, req.params.id], (err, results) => {
      if (err) throw err;
      res.json({ message: 'Product updated' });
    });
  });
  
  // Update a product partially (PATCH)
  app.patch('/products/:id', (req, res) => {
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(req.body)) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
    
    values.push(req.params.id);
  
    const updateQuery = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    connection.query(updateQuery, values, (err, results) => {
      if (err) throw err;
      res.json({ message: 'Product partially updated' });
    });
  });
  
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });