const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const ObjectId = require('mongodb').ObjectId;
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qewiq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// use async await for mongo
async function run() {
    try {
        await client.connect();

        const database = client.db('tripto-travel');
        const serviceCollection = database.collection('services');
        const blogCollection = database.collection('blogs');
        const ordersCollection = database.collection('allOrders');


        //Add Tour Post Function 
        app.post('/addtour', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.json(result);
            console.log(result);

        })

        //Tour GEt Function 
        app.get('/tours', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })


        //Get Place Order By OrderId
        app.get('/placeorder/:id', async (req, res) => {
            const orderId = req.params.id;
            const query = { _id: ObjectId(orderId) };
            const result = await serviceCollection.findOne(query);
            res.json(result);
        })

        //Post Place order By Email Id
        app.post('/placeorder', async (req, res) => {
            const orderDetails = req.body;
            const result = await ordersCollection.insertOne(orderDetails);
            res.json(result);
        })

        //Get My Orders By Email Id
        app.get('/myorders/:email', async (req, res) => {
            const userEmail = req.params.email;
            console.log(userEmail);
            const result = await ordersCollection.find({ email: userEmail }).toArray();
            res.json(result);
            console.log(result);
        })

        //Delete from My Order and All Orders
        app.delete('/myorders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

        //Get All Orders
        app.get('/allorders', async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.json(result);
        })



    }
    finally {
        // await client.close();
    }
};

run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('running my crud server')
});
app.listen(port, () => {
    console.log("running on port:", port);
});