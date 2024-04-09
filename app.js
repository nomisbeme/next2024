const express = require('express')
const http = require('http')
const axios = require('axios')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

let lastSentiment = ""
let lastScore = ""
let lastReview = ""

app.get('/', (req, res) => {
        res.send(`
        <html><head>
        <title>Training Sentiment Analyzer</title>
        <style>
        h1 { font-family: sans-serif; }
        #sentiment { font-size: 64pt; }
        #score { font-size: 8pt; color: white; }
        </style>
        </head>
        <body>
        <H1>Training Sentiment Analyzer</H1>
	<P>Enter the review below:</p>
        <form action='/' method='post'>
                <textarea id='review' name='review' rows=3 cols=40>${lastReview}</textarea>
		<p>
                <input type='submit' name='Process' value='OK' />
		</p>
        </form>
        <div id='sentiment'>
        ${lastSentiment}
        </div><p id='score'>
        ${lastScore}
        </p>
        </body>
        </html>`)

})

app.post('/', (req, res) => {
        let review = req.body["review"]
	review = review.trim()
	lastReview = review
        console.log(review);

        const headers = { 'Content-Type': 'application/json' };
        const err = axios.post('http://127.0.0.1:8080/v2/models/sentiment_analysis/infer', 
                `{"sequences": "${review}"}`, { headers })
        .then(function(response) {
                console.log(response.data);
                let la = response.data.labels[0];
                if (la == 'positive') lastSentiment = "&#128512;";
                else if (la == 'negative') lastSentiment = "&#128544;"
                else lastSentiment = "? " + response.data.labels[0];

                lastScore = response.data.scores[0];
        })
        .catch(function(error) {
                console.log(error);
                lastSentiment = "E"
                lastScore = 0.0
        });
        res.redirect('/')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
