const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const { json } = require("body-parser");
const { ObjectId } = require("mongodb");
const connectionString =
  "mongodb+srv://user:khanhPRO123@cluster0.4wmgd.mongodb.net/start-wars?retryWrites=true&w=majority";
const PORT = 7000;

const app = express();

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

MongoClient.connect(
  connectionString,
  { useUnifiedTopology: true },
  (err, client) => {
    if (err) return console.error(err);
    console.log("Connected to Database");
    const db = client.db("shopping-list");
    const productsCollection = db.collection("products");

    app.get("/", (req, res) => {
      res.send("Hello");
    });

    app.post("/product", (req, res) => {
      const newProuct = {
        name: req.body.name,
        quantity: req.body.quantity,
        priceUnit: req.body.priceUnit,
        img: req.body.img,
      };

      productsCollection
        .insertOne(newProuct)
        .then((result) => {
          console.log(result.ops);

          res.status(201).json({ some: "response" });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    app.get("/products", (req, res) => {
      db.collection("products")
        .find()
        .toArray()
        .then((result) => {
          res.send(result);
        })
        .catch((err) => console.log(err));
    });

    app.delete("/delete/:id", (req, res) => {
      const id = req.params.id.slice(2, req.params.id.length - 1);

      productsCollection
        .deleteOne({
          name: id,
        })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.status(201).json({ some: "response" });
        })
        .catch((error) => console.error(error));
    });

    app.put("/updateproduct/", (req, res) => {
      productsCollection
        .updateOne(
          {
            _id: ObjectId(req.body.id),
          },
          {
            $set: {
              name: req.body.name,
              quantity: req.body.quantity,
              priceUnit: req.body.priceUnit,
              img: req.body.img,
            },
          }
        )
        .then((result) => {
          res.status(201).json({ some: "response" });
        })
        .catch((err) => console.log(err));
    });
  }
);
