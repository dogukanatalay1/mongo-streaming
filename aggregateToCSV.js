"use strict";

const { MongoClient } = require("mongodb");
const { stringify } = require('csv');
const fs = require('fs').promises;

function convertArrayToCSV(data, filePath) {
    return new Promise((resolve, reject) => {
        stringify(data, { header: true, delimiter: ',' }, (err, output) => {
            if (err) {
                console.log('Error during CSV stringification:', err);
                return reject(err);
            }

            fs.writeFile(filePath, output)
                .then(() => {
                    console.log(`CSV successfully saved to ${filePath}`);
                    resolve(`CSV successfully saved to ${filePath}`);
                })
                .catch(err => {
                    console.log('Error writing CSV to file:', err);
                    reject(err);
                });
        });
    });
}

const dbName = "sampleDb";
const colName = "sampleCollection";

async function connectToDatabase() {
    try {
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to database successfully');
        return client;
    } catch (err) {
        console.log('Database connection error:', err);
        throw err;
    }
}

async function aggregateData(client) {
    try {
        const db = client.db(dbName);
        const col = db.collection(colName);

        const results = await col.aggregate([]).toArray();
        console.log('Data aggregated successfully');

        return { results, client };
    } catch (err) {
        console.log('Aggregation error:', err);
        client.close();
        throw err;
    }
}

async function cmd() {
    try {
        const client = await connectToDatabase();
        const { results, client: dbClient } = await aggregateData(client);
        
        const resultMessage = await convertArrayToCSV(results, "test.csv");
        dbClient.close();

        return resultMessage;
    } catch (err) {
        console.log('Operation failed:', err);
        throw err;
    }
}

module.exports = cmd;
