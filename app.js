const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");


const app = express();
const items = ["buy food", "eat food", "cook food"];
const ItemsInWork = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", function(req, res) {


  let givenDay = date.getDate();
  res.render("lists", { listTitle: givenDay, itemelements: items });
});



app.post("/", function(req, res) {

  let item = req.body.newitem;
  if(req.body.List === "work"){
    ItemsInWork.push(item);
    res.redirect("/work");
  }else{
    items.push(item);
    res.redirect("/");
  }
 
});


app.get("/work", function(req, res){
  res.render("lists", {listTitle: "work list", itemelements: ItemsInWork});
})


app.get("/about", function(req, res){
  res.render("about");
})

app.listen(4000, function() {
  console.log("Server is running on port 4000");
});






















// res.render("lists", {}); cannot write here because a webpage rendering should cotain all the data
  // that need to be updated



    //     if(day === 6 || day === 0){
  //         givenDay = "weekend";
  //     }
  //    else{
  //     //    res.send("OH nooo, it's a work day!!");
  //         givenDay = "weekday";
  //    }

  //   if(day === 0 || day === 6){
  //     res.render("lists", { day: givenDay, status: "no need to got to work"});
  //   }else{
  //       res.render("lists", {day: givenDay, status: ", need to got  to work"});
  //   }
