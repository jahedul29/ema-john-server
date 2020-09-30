const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n6je5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello ema-john-server working fine");
});

client.connect((err) => {
  const productCollection = client
    .db(process.env.DB_NAME)
    .collection("products");
  const orderCollection = client.db(process.env.DB_NAME).collection("orders");

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    console.log(product);
    productCollection.insertOne(product).then((result) => console.log(result));
  });

  app.get("/products", (req, res) => {
    productCollection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });

  app.get("/product/:key", (req, res) => {
    productCollection.find({ key: req.params.key }).toArray((err, docs) => {
      res.send(docs[0]);
    });
  });

  app.post("/getCartProducts", (req, res) => {
    const productKeys = req.body;
    console.log(productKeys);
    productCollection
      .find({ key: { $in: productKeys } })
      .toArray((err, docs) => {
        res.send(docs);
      });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    console.log(req.body);
    console.log("Order Adding");
    orderCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.listen(port);
