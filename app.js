const express = require('express')
const http = require('http')
const axios = require('axios')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

let lastSentiment = ""
let lastScore = ""

app.get('/', (req, res) => {
        res.send(`
        <html><head>
        <title>Sentiment Analyzer for InsureCorp</title>
        <style>
        h1 { font-family: sans-serif; }
        #sentiment { font-size: 64pt; }
        #score { font-size: 8pt; color: gray; }
        </style>
        </head>
        <body>
        <H1>Sentiment Analyzer for InsureCorp</H1>
        <form action="/" method="post">
                <input id="review" type="text" name="review" size=60 value=""/>
                <input type="submit" name="Process" value="OK" />
        </form>
        <div id="sentiment">
        ${lastSentiment}
        </div><p id="score">
        ${lastScore}
        </p>
        </body>
        </html>`)

})

app.post('/', (req, res) => {
        let review = req.body["review"]
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
