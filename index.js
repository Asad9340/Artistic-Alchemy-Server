const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Artistic Alchemy!');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kj2w8eq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const UserCraftCollection = client
      .db('ArtisticAlchemy')
      .collection('userCraft');
    const subcategoryCollection = client
      .db('ArtisticAlchemy')
      .collection('categories');

    app.get('/categories/subcategory', async (req, res) => {
      const subcategory = req.params.subcategory;
      const query = { subcategory_name: subcategory };
      const cursor = subcategoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/allArtCraft', async (req, res) => {
      const cursor = UserCraftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/details/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await UserCraftCollection.findOne(query);
      res.send(result);
    });
    app.get('/update/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await UserCraftCollection.findOne(query);
      res.send(result);
    });

    app.get('/myCraft/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = UserCraftCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/addCraft', async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await UserCraftCollection.insertOne(newCraft);
      res.send(result);
    });

    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const changedCraft = req.body;
      const updatedCraft = {
        $set: {
          image: changedCraft.image,
          item_name: changedCraft.item_name,
          subcategory_name: changedCraft.subcategory_name,
          description: changedCraft.description,
          price: changedCraft.price,
          rating: changedCraft.rating,
          customization: changedCraft.customization,
          processing_time: changedCraft.processing_time,
          stock_status: changedCraft.stock_status,
        },
      };
      const result = await UserCraftCollection.updateOne(
        filter,
        updatedCraft,
        options
      );
      res.send(result);
    });

    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await UserCraftCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log('Project is listening on port ', port);
});
