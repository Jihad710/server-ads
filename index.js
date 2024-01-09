const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the database

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ylybov4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to the database and define collection
async function run() {
  try {
    // await client.connect();
    console.log('Connected to the database');

    // Create or get the 'gojiDb' database
    const database = client.db("gojiDb");

    // Create or get the 'order' collection
    const orderCollection = database.collection("order");

    // Set the collection in app.locals
    app.locals.orderCollection = orderCollection;

    console.log('Database and collection initialized');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

run(); // Call the run function to connect to the database

// Express route to handle order submission
app.post('/submitOrder', async (req, res) => {
  try {
    const orderInfo = req.body;

    // Ensure any asynchronous operations are awaited
    const result = await app.locals.orderCollection.insertOne(orderInfo);

    res.status(201).json({ message: 'Order submitted successfully', orderId: result.insertedId });
  } catch (error) {
    console.error('Error submitting order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
