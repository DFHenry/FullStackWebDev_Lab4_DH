import mongoose from "mongoose";
import {MongoClient, ObjectId} from "mongodb";

const dbUrl = `${process.env.MONGO_URI}${process.env.DB_NAME}`;
const db = new MongoClient(dbUrl).db("movies_db");

const MovieSchema = new mongoose.Schema({
  name: String,
  year: Number,
  rating: String
});

const Movies = mongoose.model("Movies", MovieSchema);

await mongoose.connect(dbUrl);

//FUNCTIONS

//INITIALIZE - if no existing movies on DB, populate with a few

async function initializeMovies() 
{
    console.log("Initialize");
    let movieArray = 
    [
        {
            name: "Star Wars",
            year: 1977,
            rating: "PG"
        },
        {
            name: "The Terminator",
            year: 1984,
            rating: "R"
        },
        {
            name: "Minions",
            year: 2015,
            rating: "PG"
        },
    ];
    await Movies.insertMany(movieArray);
}

async function getOneMovie(id)
{
    const editId = {_id: new ObjectId(String(id)) };
    const result = await db.collection("movies").findOne(editId);

    return await result;
}

async function getMovies()
{
    return await Movies.find({});
}

async function updateMovieRating(filter, newRating) 
{
    let updateMovieRatingInfo = 
    {
        $set:
        {
            name: newRating.name,
            year: newRating.year,
            rating: newRating.rating
        },
    };

    const result = await db.collection("movies").updateOne(filter, updateMovieRatingInfo);
    return result;
}

async function detelteMovieByRating(rating) 
{
    await Movies.deleteMany({ rating: String("R")});
}

export default
{
    initializeMovies,
    getOneMovie,
    getMovies,
    updateMovieRating,
    detelteMovieByRating
}