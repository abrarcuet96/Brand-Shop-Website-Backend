const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// abrarhaider1357
// UCiQ9fa8AWOPench


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://abrarhaider1357:UCiQ9fa8AWOPench@cluster0.0zifi4k.mongodb.net/?retryWrites=true&w=majority";

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
        const productCollection= client.db("productsDB").collection("products");

        // CREATE:
        app.post('/products', async(req,res)=>{
            const product= req.body;
            const result= await productCollection.insertOne(product);
            res.send(result);
        });
        app.get('/products', async(req,res)=>{
            const result= await productCollection.find().toArray();
            res.send(result);
        });








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