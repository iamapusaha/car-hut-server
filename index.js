const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware 
app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.w6ksnak.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        const brandCollection = client.db("brandDB").collection("brand")
        const productCollection = client.db("productDB").collection("product")
        //produuct route
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })
        app.get('/product/:brand', async (req, res) => {
            const brand = req.params.brand;
            const query = { brand: brand };
            const cursor = productCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
            console.log(result);
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            console.log(result);
            res.send(result)
        })
        //Brand route
        app.post('/brand', async (req, res) => {
            const newBrand = req.body;
            console.log(newBrand);
            const result = await brandCollection.insertOne(newBrand);
            res.send(result)
        })
        app.get('/brand', async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("hello,welcome to our server")
})
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})
