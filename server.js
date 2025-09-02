require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Configure your MySQL connection details from environment variables
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

// Webhook endpoint to receive and save form data
app.post('/webhook/mailmodo', (req, res) => {
  console.log('Received webhook data:', req.body);

  const {
    companyName,
    contactNumber,
    recipientEmail,
    responseId,
    recordedAt,
    formId
  } = req.body;

  // Convert recordedAt.ts (Unix timestamp in seconds) to MySQL DATETIME string
  const recordedAtDate = recordedAt && recordedAt.ts
    ? new Date(recordedAt.ts * 1000).toISOString().slice(0, 19).replace('T', ' ')
    : null;

  const query = `
    INSERT INTO campaign_form
      (company_name, contact_number, recipient_email, response_id, recorded_at, form_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [companyName, contactNumber, recipientEmail, responseId, recordedAtDate, formId],
    (err) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).send('Database error');
        return;
      }
      res.send('Data inserted successfully');
    }
  );
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
