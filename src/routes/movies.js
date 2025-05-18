const express = require("express");
const router = express.Router();
const db = require("../db/crud");
const validateMovie = require("../middleware/validateMovie"); // Adicione esta linha

router.get("/", async (req, res) => {
  try {
    const movies = await db.getMoviesByFilter(req.query);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving movies" });
  }
});

router.get("/awards-intervals", async (req, res) => {
  try {
    const result = await db.getAwardsIntervals();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error calculating intervals" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await db.getMovieById(req.params.id);
    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
    } else {
      res.json(movie);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving movie" });
  }
});

router.post("/", validateMovie, async (req, res) => {
  try {
    const addMovie = await db.createMovie(req.body);
    res.status(201).json(addMovie);
  } catch (error) {
    res.status(400).json({ message: "Error to create movie" });
  }
});

router.put("/:id", validateMovie, async (req, res) => {
  try {
    const updatedMovie = await db.updateMovie(req.params.id, req.body);
    if (!updatedMovie) {
      res.status(404).json({ message: "Movie not found" });
    } else {
      res.json(updatedMovie);
    }
  } catch (error) {
    res.status(400).json({ message: "Error to update movie" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const removeMovie = await db.deleteMovie(req.params.id);
    if (!removeMovie) {
      res.status(404).json({ message: "Movie not found" });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting movie" });
  }
});

module.exports = router;
