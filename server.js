"use strict";

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const server = express();
require("dotenv").config();
server.use(cors());
server.use(express.json());
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT;

const Schema = new mongoose.Schema({
  email: String,
  title: String,
  imageUrl: String,
});

const chocoModel = mongoose.model("choco", Schema);

server.listen(PORT, () => {
  console.log("READY ON 4000");
});

server.get("/test", test);
server.get("/getData", getData);
server.post("/addfav", addToFavorite);
server.get("/getfav", getFavorite);
server.delete("/delete/:id", deleteFromFavorite)
server.put("/update/:id", updateFromFavorite)
function test(req, res) {
  res.send("ALIVE");
}

async function getData(req, res) {
  let chocoData = await axios.get(
    "https://ltuc-asac-api.herokuapp.com/allChocolateData"
  );

  res.send(chocoData.data);
}

async function addToFavorite(req, res) {
  let email = req.query.email;

  let { title, imageUrl } = req.body;

  await chocoModel.create({ email, title, imageUrl });
}

async function getFavorite(req, res) {
  let email = req.query.email;

  chocoModel.find({ email: email },
    function (err, collection) {
      if (err) {
        console.log("error", email);
      } else {
          console.log('your data', collection);
        res.send(collection);
      }
    });
}

async function deleteFromFavorite(req, res) {
   let id = req.params.id;
  
    chocoModel.remove({ _id: id },
      function (err, deleted) {
        if (err) {
          console.log("error in delete");
        } else {
            console.log('deleted', deleted);
            getFavorite(req, res);
        }
      });
  }


  async function updateFromFavorite(req, res) {
    let id = req.params.id;
   
    let { title, imageUrl } = req.body;

     chocoModel.findOneAndUpdate(id,{ title, imageUrl },
       function (err, updated) {

        


         if (err) {
           console.log("error in delete");
         } else {
             console.log('deleted', updated);
             getFavorite(req, res);
         }
       });
       let email = req.query.email; 
       chocoModel.find({email}, function (err, back){

if (err) {

console.log("error");

} else {

res.send(back);

}


       })

   }