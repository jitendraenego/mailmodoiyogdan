require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Create MySQL connection pool for stable connection management
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Webhook endpoint to receive and save form data
app.post('/webhook/mailmodo', (req, res) => {
  const scheme = req.headers['scheme'];  // Get scheme from headers

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

  // Fixed placeholders - 7 fields, 7 placeholders
  const query = `
    INSERT INTO campaign_form
      (company_name, contact_number, recipient_email, response_id, recorded_at, form_id, scheme)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    query,
    [companyName, contactNumber, recipientEmail, responseId, recordedAtDate, formId, scheme],
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
