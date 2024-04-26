const express = require('express');
const generateByAggregate = require('./aggregateToCSV'); 
const generateByStream = require("./streamToCSV");
const fake = require("./faker");

const app = express();
const port = 3000;

app.post('/fake', async (req, res) => {
    await fake();
    res.status(200).send({
        message: "I am up and running!"
    });
});

app.get('/generate', async (req, res) => {
    try {
        console.time('cmd Execution Time Aggregation');
        const result = await generateByAggregate();  
        console.timeEnd('cmd Execution Time Aggregation'); 

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/generate/stream', async (req, res) => {
    try {
        console.time('cmd Execution Time Streaming');
        const result = await generateByStream();  
        console.timeEnd('cmd Execution Time Streaming'); 

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
