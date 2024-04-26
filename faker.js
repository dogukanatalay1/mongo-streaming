const { MongoClient } = require("mongodb");

async function generateData() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB successfully");
        
        const database = client.db('sampleDb');
        const collection = database.collection('sampleCollection');

        const mockData = Array.from({ length: 100000 }, (_, i) => ({
            name: `User${i}`,
            age: Math.floor(Math.random() * 100),
            email: `user${i}@example.com`
        }));

        const result = await collection.insertMany(mockData);
        console.log(`${result.insertedCount} documents were inserted`);
    } catch (error) {
        console.error('Failed to insert documents:', error);
    } finally {
        await client.close();
    }
}

module.exports = generateData;
