const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const moment = require('moment-timezone');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000;

app.get('/word', (req, res) => {
  // Current date and time in UTC
  const utcDate = new Date();

  // Convert to Iowa time zone (America/Chicago)
  const iowaDate = moment(utcDate).tz("America/Chicago").format('/MMDD');

  // Construct the URL
  const url = `https://www.stockq.org/life/wordle/${utcDate.getFullYear()}${iowaDate}.php`;

  axios.get(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      // Extract the text content
      const text = $('body').text();

      // Find the part of the text that contains the solution
      const match = text.match(/The word today \(\w+ \d{2}\) is (\w+)/);

      if (match) {
        const solution = match[1];
        res.send(solution);
      } else {
        console.log("Could not find the word.");
        res.status(404).send("Could not find the word.");
      }
    })
    .catch(error => {
      console.error("Error fetching the webpage:", error);
      res.status(500).send("Error fetching the webpage.");
    });
});

app.listen(PORT)
