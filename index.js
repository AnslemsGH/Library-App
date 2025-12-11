import express from "express";
import cors from "cors";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(cors());

const dbUrl = "mongodb+srv://AnslemAssignment:anslem@webdevclass.0kw2y5y.mongodb.net/?appName=WebDevClass";
const db = new MongoClient(dbUrl).db("Library");

const __dirname = import.meta.dirname;

const port = process.env.PORT || "8888";

app.set("views", path.join(__dirname, "templates"));

app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (request, response) => {
    response.render("index", { title: "Home" });
});

app.get("/about", (request, reponse) => {
    reponse.render("about", { title: "About" });
})


//-----BOOKS-----
app.get("/admin/books", async (request, response) => {
    let books = await getBooks();
    // console.log(books);
    response.render("books", { title: "Books", menu: books });
});

app.get("/admin/books/add", async (request, response) => {
    let books = await getBooks();
    // console.log(books);
    response.render("addbooks", { title: "Add Books", menu: books });
});

app.post("/admin/books/add/submit", async (request, response) => {
    // console.log(request.body);
    let newBook = {
        title: request.body.title,
        author: request.body.author,
        genre: request.body.genre
    };
    await addBook(newBook);
    response.redirect("/admin/books");
});

app.get("/admin/books/delete", async (request, response) => {
    let id = request.query.bookId;

    await deleteBook(id);
    response.redirect("/admin/books");

});

app.get("/admin/books/edit", async (request, response) => {
    let bookId = request.query.bookId;
    if (!bookId) {
        response.redirect("/admin/book");
    }
    let book = await db.collection("Books").findOne({ _id: new ObjectId(String(bookId)) });
    let books = await getBooks();
    response.render("editbook", { title: "Edit Book", menu: books, book })
});
app.post("/admin/books/edit/submit", async (request, response) => {
    let bookId = request.body.bookId;
    if (!bookId) {
        return response.redirect("/admin/books");
    }
    let updatedBook = {
        title: request.body.title,
        author: request.body.author,
        genre: request.body.genre
    };

    let bookfilter = { _id: new ObjectId(String(bookId)) };
    await editBook(bookfilter, updatedBook);
    response.redirect("/admin/books");
});


//-------------AUTHORS--------------
app.get("/admin/authors", async (request, reponse) => {
    let authors = await getAuthors();
    // console.log(authors);
    reponse.render("authors", { title: "Authors", menu: authors });
})

app.get("/admin/authors/add", async (request, response) => {
    let authors = await getAuthors();
    response.render("addauthors", { title: "Add Authors", menu: authors });
});

app.post("/admin/authors/add/submit", async (request, response) => {
    // console.log(request.body);
    let newAuthor = {
        name: request.body.name,
        nationality: request.body.nationality,
        birthyear: request.body.birthyear
    };
    await addAuthor(newAuthor);
    response.redirect("/admin/authors");
});

app.get("/admin/authors/delete", async (request, response) => {
    let id = request.query.authorId;

    await deleteAuthor(id);
    response.redirect("/admin/authors");

});


//---API ENDPOINTS-----------//
app.get("/api/books", async (req, res) => {
  try {
    const books = await getBooks();
    res.json(books);
  } catch (err) {
    console.error("Error fetching books for API:", err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.get("/api/authors", async (req, res) => {
  try {
    const authors = await getAuthors();
    res.json(authors);
  } catch (err) {
    console.error("Error fetching authors for API:", err);
    res.status(500).json({ error: "Failed to fetch authors" });
  }
});


//FUNCTIONS--------//

async function getBooks() {
    let bookresults = db.collection("Books").find({});
    return await bookresults.toArray();
}

async function addBook(book) {
    let bookstatus = await db.collection("Books").insertOne(book);
    console.log("Book Added!");
}

async function deleteBook(id) {
    let bookDeleteQuery = { _id: new ObjectId(String(id)) }
    let bookdelete = await db.collection("Books").deleteOne(bookDeleteQuery);
}

async function editBook(bookfilter, book) {
    let bookstatus = await db.collection("Books").updateOne(bookfilter, { $set: book });
    if (bookstatus.modifiedCount === 1) {
        console.log("Book updated successfully");
    }
    else {
        console.log("No changes were made to the Book");
    }
}


async function getAuthors() {
    let authorresults = db.collection("Authors").find({});
    return await authorresults.toArray();
}

async function addAuthor(author) {
    let authorstatus = await db.collection("Authors").insertOne(author);
    console.log("Author Added!");
}

async function deleteAuthor(id) {
    let authorDeleteQuery = { _id: new ObjectId(String(id)) }
    let authordelete = await db.collection("Authors").deleteOne(authorDeleteQuery);
}




app.listen(port, () => {
    console.log(`Listening to http://localhost:${port}`);
});

