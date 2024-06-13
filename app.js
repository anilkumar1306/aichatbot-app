const express = require("express");
const collection = require("./mongo");
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/", async (req, res) => {
  const { email, password } = req.body;

  const data = {
    email: email,
    password: password,
  };
  try {
    const check = await collection.findOne({ email: email, password: password});

    if (check) {
      res.json("exist");
    } else {
      res.json("not exist");
    }
  } catch (e) {
    res.json("not exist");
  }
});

app.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

  const data = {
    username: username,
    email: email,
    password: password,
  };
  try {
    const check = await collection.findOne({ email: email });

    if (check) {
      res.json("exist");
    } else {
      res.json("not exist");
      await collection.insertMany([data]);
    }
  } catch (e) {
    res.json("not exist");
  }
});

app.listen(8000, () => {
  console.log("port is connected");
});