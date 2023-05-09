const express = require("express");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://yasser30855:3085Yasser@cluster0.tgzn5bh.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connection succeeded");
  })
  .catch((error) => {
    console.log("--------error---------");
    console.log(error);
  });

const app = express();
app.set("view engine", "ejs");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

const Blog = require("./models/blog");
const User = require("./models/user");

app.get("/addblog", (req, res) => {
  const newBlog = new Blog({
    title: "my blog",
    body: "hello this is my blog",
  });
  newBlog.save().then((data) => {
    res.send(data);
  });
});

// ------------ create users form ---------

app.get("/addUsers", (req, res) => {
  res.render("usersForm");
});

app.post("/usercreated", (req, res) => {
  const u = new User({
    username: req.body.username,
    password: req.body.userpassword,
    email: req.body.useremail,
    role: req.body.userrole,
  });
  u.save()
    .then(() => {
      res.send("user created");
    })
    .catch((e) => {
      res.send(e.message);
    });
});

// --------- show all users -------
app.get("/showallusers", (req, res) => {
  User.find().then((user) => {
    res.render("showallusers", { user });
  });
});

//---------- show blogsform -----------
app.get("/blogsform", (req, res) => {
  res.render("blogsform");
});

//----------- create blog from ejs file --------

app.post("/blogcreated", (req, res) => {
  const b = new Blog({
    title: req.body.blogtitle,
    body: req.body.blogbody,
  });
  b.save().then(() => {
    res.redirect("/showallblogs");
  });
});
// ------------ show all blogs ----------
app.get("/showallblogs", (req, res) => {
  Blog.find().then((blog) => {
    res.render("showallblogs", { blog });
  });
});

app.get("/blogdetails/:id", (req, res) => {
  const blogId = req.params.id;
  Blog.findById(blogId).then((blog) => {
    res.render("showoneblog", { b: blog });
  });
});
//-------- blogs update form -------
app.get("/blogsupdateform/:id", (req, res) => {
  const blogId = req.params.id;
  Blog.findById(blogId).then((blog) => {
    res.render("blogsform", { blog });
  });
});

app.post("/blogupdate/:id", (req, res) => {
  const blogId = req.params.id;
  Blog.findById(blogId).then((blog) => {
    blog.title = req.body.blogtitle;
    blog.body = req.body.blogbody;
    blog.save().then(() => {
      res.redirect("/showallblogs");
    });
  });
});
// ---------- blog delete -----------
app.get("/blogdelete/:id", (req, res) => {
  const blogId = req.params.id;
  Blog.findByIdAndDelete(blogId).then(() => {
    res.redirect("/showallblogs");
  });
});

app.get("/", (req, res) => {
  res.send("Hello from express ");
});

app.listen(7500, () => {
  console.log("we are listining");
});
