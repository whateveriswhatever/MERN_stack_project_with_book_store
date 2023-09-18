import express from "express";
import { Book } from "../models/BookModel.js";

const router = express.Router();

// Route for SAVE a new book into the database
router.post("/", async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({
        message:
          "Please provide the required fields: title, author, publishYear",
      });
    }

    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
    });

    const savedBook = await newBook.save();
    return res.status(201).send(savedBook);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error creating a new book" });
  }
});

// Route for GET all books from database
router.get("/", async (req, res) => {
  try {
    const books = await Book.find({});
    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

// Route for GET one book from database based on id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const searchedBook = await Book.findById(id);

    return res.status(200).json(searchedBook);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: err.message });
  }
});

// Route for Update a book
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }
    const { id } = req.params;

    const conseq = await Book.findByIdAndUpdate(id, req.body);

    // if the book isn't founded or not was created in database
    if (!conseq) {
      return res.status(400).json({ message: "Book not found" });
    }

    return res.status(200).send({ message: "Book updated successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: err.message });
  }
});

// Route for Deleting a book
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const searchedBook = await Book.findByIdAndDelete(id);

    // if the book we search is not existed or created inner the database
    if (!searchedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).send({ message: "Book deleted successfully!" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: err.message });
  }
});

export default router;
