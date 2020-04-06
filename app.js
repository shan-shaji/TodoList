// modules imported
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express(); // creates an express app
app.set("view engine", "ejs"); // sets the templating ejs

app.use(bodyParser.urlencoded({ extended: true })); // to get form data in readable form.
app.use(express.static("public")); // sets the folder as to access the static files.

// Connects to the mongodb Server.
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});

// Creates an item schema to store the todo list items.
const itemsSchema = {
  name: String,
};

// a collection is created using the itemschema having name as Item which is singular
// mongoose converts this name to plural and creates the collection.
const Item = mongoose.model("Item", itemsSchema);

// Default items in the todo list
const item1 = new Item({
  name: "Welcome to your todolist!",
});

const item2 = new Item({
  name: "Hit the + button to add a new item.",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});

// Default items array
const defaultItems = [item1, item2, item3];

// Creating a list schema to create difffrent list like work, home, job etc.....
// Here the list schema consist of an items array containg objects of struture itemschema.
const listSchema = {
  name: String,
  items: [itemsSchema],
};

// creates a list collection with name List which is singular

const List = mongoose.model("List", listSchema);

//========================================================================================

// request handling when browser request for the home route.
app.get("/", function (req, res) {
  // will return all the items in the collection as an array - Item
  Item.find({}, function (err, foundItems) {
    // if the collection items  in the array have length === 0 then the default item will be inserted in
    // the Item collection
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      // after insertion it should be rendered in the web page so
      // it is redirected to the home route
      res.redirect("/");
    } else {
      // if there are elements in the collection this block will be executed and the
      // founditems are passed to the webpage
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

// to create a custom List
app.get("/:customListName", function (req, res) {
  // custom list name is capitalized using the lodash package. _.capitalize()
  const customListName = _.capitalize(req.params.customListName);

  // find the one document from the collection List having name = customListName
  List.findOne({ name: customListName }, function (err, foundList) {
    // if there is no error
    if (!err) {
      // if there is no list
      if (!foundList) {
        //Create a new list
        // with the customListName and the default items as the array of object with objects having
        // the structure of listschema
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        // after creating the new list it is saved
        list.save();
        // now it is redirected to that same customname now it has elements so the else block
        // will execute.
        res.redirect("/" + customListName);
      } else {
        //Show an existing list
        // if elements are present wiith thahtt list name in the collection List
        // this block will be executed and the webpage is rendered using the data from the foundlist.
        // foundlist.name = is the new name of the list.
        // foundlist.items = is the array of objects of itemschema.
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

// when user enters a data.

app.post("/", function (req, res) {
  // gets the dat athat the user entered
  const itemName = req.body.newItem;
  // also gets in which the user entered.
  const listName = req.body.list;

  // after getting the item new object is created with the structure of item schema
  const item = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    // if it is today this object is saved in item collection
    // after saving it is then redirected to the home route and is rendered in the page.
    item.save();
    res.redirect("/");
  } else {
    // if it is another list suppose if it is work 
    // findOne will check for the listname work and will return the foundList
    // findone will only return one item haviing listname work
    // we insert the element into the foundlist using foundlist.items.push()
    // after pushing the element it is then redirected to the same listName route
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

// to delete an item when the check box is clicked

app.post("/delete", function (req, res) { 

  // gets the id of the checked item
  // also the listName 
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;


  // if the list item is today then it is deleted using id
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    // if it is not today ie, if it is an another list. 
    // we use the findOneAndUpdate method .
    // this method will return one element having the listName.
    // Using $pull the required item is deleted using the id
    // here items is an array of objects
    List.findOneAndUpdate(
      { name: listName }, // query
      { $pull: { items: { _id: checkedItemId } } }, // update
      function (err, foundList) { // callback
        if (!err) {
          // if there isss no error it redirects to the listName
          // and renders the page
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
