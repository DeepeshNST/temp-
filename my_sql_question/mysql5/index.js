// You are developing a web application for a library. The library database consists of three tables: books, authors, and borrowers.

//  CREATE TABLE authors (
//     author_id INT PRIMARY KEY AUTO_INCREMENT,
//     name VARCHAR(255) NOT NULL,
//     birthdate DATE
// );

// CREATE TABLE books (
//     book_id INT PRIMARY KEY AUTO_INCREMENT,
//     title VARCHAR(255) NOT NULL,
//     author_id INT,
//     genre VARCHAR(100),
//     price DECIMAL(10, 2) NOT NULL,
//     published_date DATE,
//     FOREIGN KEY (author_id) REFERENCES authors(author_id)
// );

// CREATE TABLE borrowers (
//     borrower_id INT PRIMARY KEY AUTO_INCREMENT,
//     name VARCHAR(255) NOT NULL,
//     contact_info VARCHAR(255),
//     borrowed_book_id INT,
//     borrow_date DATE,
//     return_date DATE,
//     FOREIGN KEY (borrowed_book_id) REFERENCES books(book_id)
// );

// Insert a new author record: Write an SQL query to insert a new author named "George Orwell" born on "1903-06-25".
// Insert a new book record: Write an SQL query to insert a new book titled "1984" by George Orwell, genre "Dystopian", price $15.99, and published on "1949-06-08".
// Retrieve all books by a specific author: Write an SQL query to fetch all books written by George Orwell.
// Update the return date of a borrowed book: Write an SQL query to update the return date of the borrowed book with borrower_id 2 to "2024-06-20".
// Delete a borrower record: Write an SQL query to delete the borrower with borrower_id 4 from the table.
// Answer Explanations:



const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Da.2>RL2%OpE',
  database: 'testdb'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');

  // Create tables and seed initial data
  createTablesAndSeed();
});

function createTablesAndSeed() {
  createAuthorsTable();
  createBooksTable();
}

function createAuthorsTable() {
  const createAuthorsTableQuery = `
    CREATE TABLE IF NOT EXISTS authors (
      author_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      birthdate DATE NOT NULL
    )
  `;
  connection.query(createAuthorsTableQuery, (err, results) => {
    if (err) throw err;
    console.log('Authors table created');

    seedAuthors();
  });
}

function seedAuthors() {
  const authors = [
    { name: 'John Doe', birthdate: '1980-01-01' },
    { name: 'Jane Smith', birthdate: '1985-05-15' },
    { name: 'Alice Johnson', birthdate: '1990-10-20' }
  ];

  authors.forEach(author => {
    insertAuthor(author, (err, results) => {
      if (err) throw err;
      console.log(`Inserted author: ${author.name}`);
    });
  });
}

function insertAuthor(author, callback) {
  const { name, birthdate } = author;
  const query = 'INSERT INTO authors (name, birthdate) VALUES (?, ?)';
  connection.query(query, [name, birthdate], callback);
}

function createBooksTable() {
  const createBooksTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
      book_id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author_id INT,
      genre VARCHAR(255),
      price DECIMAL(10, 2),
      published_date DATE,
      FOREIGN KEY (author_id) REFERENCES authors(author_id)
    )
  `;
  connection.query(createBooksTableQuery, (err, results) => {
    if (err) throw err;
    console.log('Books table created');

    seedBooks();
  });
}

function seedBooks() {
  const books = [
    { title: 'Book 1', author_name: 'John Doe', genre: 'Fiction', price: 19.99, published_date: '2022-01-01' },
    { title: 'Book 2', author_name: 'Jane Smith', genre: 'Fantasy', price: 24.99, published_date: '2022-02-15' },
    { title: 'Book 3', author_name: 'Alice Johnson', genre: 'Science Fiction', price: 29.99, published_date: '2022-03-20' }
  ];

  books.forEach(book => {
    insertBook(book, (err, results) => {
      if (err) throw err;
      console.log(`Inserted book: ${book.title}`);
    });
  });
}

function insertBook(book, callback) {
  const { title, author_name, genre, price, published_date } = book;
  const query = `
    INSERT INTO books (title, author_id, genre, price, published_date)
    VALUES (?, (SELECT author_id FROM authors WHERE name = ?), ?, ?, ?)
  `;
  connection.query(query, [title, author_name, genre, price, published_date], callback);
}

function getBooksByAuthor(author, callback) {
  const query = `
    SELECT books.* FROM books
    JOIN authors ON books.author_id = authors.author_id
    WHERE authors.name = ?
  `;
  connection.query(query, [author], callback);
}

function updateReturnDate(borrower_id, returnDate, callback) {
  const query = 'UPDATE borrowers SET return_date = ? WHERE borrower_id = ?';
  connection.query(query, [returnDate, borrower_id], callback);
}

// Function to delete a borrower
function deleteBorrower(borrower_id, callback) {
  const query = 'DELETE FROM borrowers WHERE borrower_id = ?';
  connection.query(query, [borrower_id], callback);
}

// Routes
app.post('/authors', (req, res) => {
  insertAuthor(req.body, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(results);
  });
});

app.post('/books', (req, res) => {
  insertBook(req.body, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(results);
  });
});

app.get('/books/author/:author', (req, res) => {
  getBooksByAuthor(req.params.author, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(results);
  });
});

app.put('/borrowers/:id/return', (req, res) => {
  updateReturnDate(req.params.id, req.body.return_date, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(results);
  });
});

app.delete('/borrowers/:id', (req, res) => {
  deleteBorrower(req.params.id, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
