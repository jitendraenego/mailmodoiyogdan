const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

/*
// Configure your MySQL connection details
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // your db username
  password: 'root',       // your db password
  database: 'my_database' // your db name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});
*/

// Define the endpoint to receive webhook POST data
app.post('/webhook', (req, res) => {
  console.log(req.body);
  const { companyName, contactNumber } = req.body;

  /*
  // Insert the form data into your MySQL table (adjust table/column names as needed)
  const query = 'INSERT INTO campaign_form (company_name, contact_number) VALUES (?, ?)';
  connection.query(query, [companyName, contactNumber], (err) => {
    if (err) {
      res.status(500).send('Database error');
      return;
    }
    res.send('Data inserted successfully');
  });
  */

  // Just respond for testing the endpoint
  res.send(`Received data - Company: ${companyName}, Contact: ${contactNumber}`);
});

app.listen(3002, () => {
  console.log('Server running on port 3002');
});
