const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
app.use(express.static("public"))

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    // Get the current date
    const today = new Date();

    // Format the date parts
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, '0');

    // Construct the URL
    const url = `https://www.stockq.org/life/wordle/${year}/${month}${day}.php`;

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(today);

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
          res.send(solution)
        } else {
          console.log("Could not find the word.");
        }
      })
      .catch(error => {
        console.error("Error fetching the webpage:", error);
      });
})

app.listen(PORT)
