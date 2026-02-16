import "dotenv/config";
import express from "express";
import path from "path";
import { MongoClient, ObjectId} from "mongodb";

import db from "./components/movies.js";
import { render } from "pug";

const __dirname = import.meta.dirname;

const dbUrl = `mongodb+srv://testdbuser:JspZD0Ebtn0Lotvj@class-database.9y0z7gg.mongodb.net/`;
//const db = new MongoClient(dbUrl).db("movies_db");

const app = express();
const port = process.env.PORT || "8888";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


//PAGE ROUTES
app.get("/", async (request, response) => 
{
    let movieList = await db.getMovies();
    //if nothing in collection, initialize with initializeMovies, then get movies again
    if(!movieList.length)
    {
        await db.initializeMovies();
        movieList = await db.getMovies();
    }
    response.render("index", { movies: movieList });
});

app.get("/update", async (request, response) =>
{

    let movieToEdit = await db.getOneMovie(request.query.movieId);
    let movieList = await db.getMovies();
        
    response.render("update", { editMovie: movieToEdit});
});

app.post("/update/submit", async (request, response) =>
{
    let idFilter = {_id: new ObjectId(String(request.body.movieId)) };
    let newMovieDoc = 
    {
        name: request.body.name,
        year: request.body.year,
        rating: request.body.rating

    };
    await db.updateMovieRating(idFilter, newMovieDoc);
    response.redirect("/");
});

app.get("/delete", async (request, response) =>
{
    await db.detelteMovieByRating();
    response.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
}); 