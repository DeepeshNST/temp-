const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
const logFilePath = path.join(__dirname, 'public', 'request.txt');

app.use((req, res, next) => {
  const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  fs.appendFile(logFilePath, logEntry, err => {
    if (err) {
      console.error('Failed to write to log file');
    }
  });
  next();
});



app.get("/", (req, res) => {
  res.send("Welcome")
})

app.post('/user', (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) {
    return res.status(400).json({ error: 'Name and age are required' });
  }
  res.json({ message: `Hello, ${name}! You are ${age} years old.` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app