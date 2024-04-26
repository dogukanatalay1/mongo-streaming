"use strict";

const { MongoClient } = require("mongodb");
const { Transform } = require("stream");
const { stringify } = require("csv-stringify");

const fs = require('fs');

const dbName = "sampleDb";
const colName = "sampleCollection";

const streamHandler = new Transform({
    readableObjectMode: true,
    writableObjectMode: true, 

    transform(chunk, encoding, callback) {

        // chunk = row
        this.push(chunk);
      
        callback();
    },
});

async function cmd() {

    const client = new MongoClient("mongodb://localhost:27017");
    try {
        await client.connect();

        const db = client.db(dbName);
        const col = db.collection(colName);

        const pipeline = [
        ];

        const stringifier = stringify({ 
            header: true, 
            delimiter: ',' 
        });

        const cursor = col.aggregate(pipeline);
        let stream = cursor.stream()
            .pipe(streamHandler)
            .pipe(stringifier);

        const outputStream = fs.createWriteStream("stream.csv");

        stream = stream.pipe(outputStream);

        stream
            .on("finish", () => {
                client.close();
                console.log("OPERATION SUCCESS 🎉");
                process.exit()
            })
            .on("error", (error) => {
                console.log('err: ', error.message);

                client.close();
                process.exit()
            });

    } catch (error) {
        console.log(error.message);
    } 
};

module.exports = cmd;
