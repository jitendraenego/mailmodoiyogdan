require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Configure your MySQL connection details using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Define the endpoint to receive webhook POST data
app.post('/webhook', (req, res) => {
  const { companyName, contactNumber } = req.body;

  // Insert the form data into your MySQL table (adjust table/column names as needed)
  const query = 'INSERT INTO campaign_form (company_name, contact_number) VALUES (?, ?)';
  connection.query(query, [companyName, contactNumber], (err) => {
    if (err) {
      res.status(500).send('Database error');
      return;
    }
    res.send('Data inserted successfully');
  });
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
