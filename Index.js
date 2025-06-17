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

        const booksCollection = client.db('BookShelf').collection('Books');
        const reviewsCollection = client.db('BookShelf').collection('Reviews');

        // Get all books
        app.get('/books', async (req, res) => {
            const result = await booksCollection.find().toArray();
            res.send(result);
        });

        // Add new book
        app.post('/books', async (req, res) => {
            const newBook = req.body;
            const result = await booksCollection.insertOne(newBook);
            res.send(result);
        });

        // Get single book by ID
        app.get("/books/:id", async (req, res) => {
            const id = req.params.id;
            const book = await booksCollection.findOne({ _id: new ObjectId(id) });
            res.send(book);
        });

        // Upvote a book
        app.patch('/books/:id/upvote', async (req, res) => {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({ message: "Invalid book ID" });
            }

            try {
                const result = await booksCollection.findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $inc: { upvote: 1 } },
                    { returnOriginal: false }
                );

                if (!result.value) {
                    return res.status(404).send({ message: "Book not found" });
                }

                res.send({ message: "Upvote success", updated: result.value });
            } catch (err) {
                console.error("Upvote error:", err);
                res.status(500).send({ message: "Failed to upvote book" });
            }
        });



        // Get all reviews for a book
        app.get("/reviews", async (req, res) => {
            const bookId = req.query.book_id;
            const reviews = await reviewsCollection.find({ book_id: bookId }).toArray();
            res.send(reviews);
        });

        // Post a review
        app.post("/reviews", async (req, res) => {
            const { book_id, reviewer_email } = req.body;

            const exists = await reviewsCollection.findOne({
                book_id,
                reviewer_email
            });

            if (exists) return res.status(400).send({ message: "Already reviewed" });

            const result = await reviewsCollection.insertOne(req.body);
            res.send(result);
        });

        // Update a review
        app.patch("/reviews/:id", async (req, res) => {
            const id = req.params.id;
            const { review_text } = req.body;

            const result = await reviewsCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { review_text } }
            );

            res.send(result);
        });

        // Delete a review
        app.delete("/reviews/:id", async (req, res) => {
            const result = await reviewsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            res.send(result);
        });

        // Get books by user email
        app.get('/my-books/:email', async (req, res) => {
            const email = req.params.email;
            try {
                const result = await booksCollection.find({ user_email: email }).toArray();
                res.send(result);
            } catch (err) {
                res.status(500).send({ message: 'Failed to fetch user books' });
            }
        });

        // Upvote 
        app.patch('/books/:id/upvote', async (req, res) => {
            const id = req.params.id;

            try {
                const result = await booksCollection.findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $inc: { upvote: 1 } },
                    { returnDocument: 'after' }
                );

                if (!result.value) {
                    return res.status(404).send({ message: "Book not found" });
                }

                res.send({ upvote: result.value.upvote });
            } catch (err) {
                console.error("Upvote error:", err);
                res.status(500).send({ error: "Failed to upvote", details: err.message });
            }
        });

        // Update reading status
        app.patch('/books/:id', async (req, res) => {
            const id = req.params.id;
            const { reading_status } = req.body;

            try {
                const result = await booksCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { reading_status } }
                );

                if (result.modifiedCount === 1) {
                    res.send({ message: "Status updated" });
                } else {
                    res.status(404).send({ message: "Book not found or no change" });
                }
            } catch (err) {
                console.error("Status update error:", err);
                res.status(500).send({ error: "Failed to update reading status" });
            }
        });




        // Delete book by ID
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
                console.error(" DELETE ERROR:", err);
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
    res.send('Add your Books ');
});

app.listen(port, () => {
    console.log(`Books server is running on port ${port}`);
});
