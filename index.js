const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0zifi4k.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();
        // -----------------------------------------------------------------------------------------------------
        const productCollection = client.db("productsDB").collection("products");
        const cartProductCollection = client.db("productsDB").collection("cartProducts");

        // CREATE:
        // Products:
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        });
        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        });
        // cartProducts
        app.post('/cartProducts', async (req, res) => {
            const product = req.body;
            const result = await cartProductCollection.insertOne(product);
            res.send(result);
        });
        app.get('/cartProducts', async (req, res) => {
            const result = await cartProductCollection.find().toArray();
            res.send(result);
        });
        // Update:
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        });
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedProduct = {
                $set: {
                    photo: data.photo,
                    name: data.name,
                    brand_name: data.brand_name,
                    price: data.price,
                    type: data.type,
                    description: data.description,
                    rating: data.rating
                },
            };
            const result = await productCollection.updateOne(filter, updatedProduct, options);
            res.send(result);
        });
        // Delete:
        app.delete('/cartProducts/:id', async(req,res)=>{
            const id= req.params.id;
            const query={_id: new ObjectId(id)};
            const result= await cartProductCollection.deleteOne(query);
            res.send(result);
        })








        // -----------------------------------------------------------------------------------------------------
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Brand-Shop server is running');
});
app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});