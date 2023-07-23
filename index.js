const { MongoClient } = require('mongodb');
const _ = require('lodash');

const url = 'mongodb+srv://admin:WhiteMagic@mycluster.kbteo6o.mongodb.net/node-ga?retryWrites=true&w=majority';
const dbName = 'node-ga';
const collectionName = 'timetables';

const client = new MongoClient(url);

// Timetable schema
const timetableSchema = {
    slots: [
        // Slot object example:
        // { day: 'Monday', time: '10:00 AM', subject: 'Math', room: 'Room A', teacher: 'John Doe' }
    ],
    fitness: 0,
};

// Function to initialize the database connection
async function initDatabase() {
    try {
        await client.connect();
        console.log('Connected to the database');
    } catch (err) {
        console.error('Error connecting to the database', err);
    }
}

// Function to insert a timetable into the database
exports.insertTimetable = async (timetable) => {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    try {
        await collection.insertOne(timetable);
        console.log('Inserted timetable into the database');
    } catch (err) {
        console.error('Error inserting timetable', err);
    }
}

// Function to get all timetables from the database
exports.getTimetables = async () => {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    try {
        const timetables = await collection.find({}).toArray();
        return timetables;
    } catch (err) {
        console.error('Error getting timetables', err);
        return [];
    }
}

// Function to close the database connection
exports.closeDatabase = async () => {
    await client.close();
    console.log('Database connection closed');
}

// Call initDatabase() at the start of your application
initDatabase();