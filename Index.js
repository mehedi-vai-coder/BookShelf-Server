require('dotenv').config()
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { ObjectId } = require('mongodb');

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tmx4o0d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();

        const booksCollection = client.db('BookShelf').collection('Books')

        //Books API get data 
        app.get('/books', async (req, res) => {
            const result = await booksCollection.find().toArray();
            res.send(result);
        });

        // Add Book 
        app.post('/books', async (req, res) => {
            const newBook = req.body;
            const result = await booksCollection.insertOne(newBook);
            res.send(result);
        });

        // Get Books by User Email
        app.get('/my-books/:email', async (req, res) => {
            const email = req.params.email;
            try {
                const result = await booksCollection.find({ user_email: email }).toArray();
                res.send(result);
            } catch (err) {
                res.status(500).send({ message: 'Failed to fetch user books' });
            }
        });


        //  update a book
        app.put('/books/:id', async (req, res) => {
            const id = req.params.id;
            const updatedBook = req.body;

            try {
                const result = await booksCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedBook }
                );

                if (result.modifiedCount > 0) {
                    res.send({ success: true });
                } else {
                    res.status(404).send({ message: "Book not found or no changes made." });
                }
            } catch (err) {
                console.error("🚨 Update error:", err);
                res.status(500).send({
                    error: "Failed to update book",
                    details: err.message
                });
            }
        });



        // DELETE book by ID
        app.delete('/books/:id', async (req, res) => {
            const id = req.params.id;

            try {
                if (!ObjectId.isValid(id)) {
                    return res.status(400).send({ error: "Invalid ID format" });
                }

                const result = await booksCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount > 0) {
                    res.send({ success: true });
                } else {
                    res.status(404).send({ message: "Book not found" });
                }
            } catch (err) {
                console.error("❌ DELETE ERROR:", err); 
                res.status(500).send({ error: "Failed to delete", details: err.message });
            }
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Add your Books ')
});

app.listen(port, () => {
    console.log(`Books server is running on port ${port}`)
});