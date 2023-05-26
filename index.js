const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const port =process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json());




const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.jvbgqui.mongodb.net/?retryWrites=true&w=majority`;

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

const productCollection=client.db('emaJohn').collection("products");

    //SERVICE ALL DATA FIND
    app.get('/products', async (req,res)=>{
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const skip = page * limit;

      const result = await productCollection.find().skip(skip).limit(limit).toArray();
        res.send(result);
    })

    // this for all products count
    app.get('/totalProducts',async (req,res)=>{
      const result= await productCollection.estimatedDocumentCount();
      res.send({totalProducts:result})
    })

    app.post('/productsByIds', async(req, res) => {
      const ids = req.body;
      const objectIds = ids.map(id => new ObjectId(id));
      const query = { _id: { $in: objectIds } }
      console.log(ids);
      const result = await productCollection.find(query).toArray();
      res.send(result);
    })

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
  res.send('Ema John')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})