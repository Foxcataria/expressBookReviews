const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({data: {"username": username, "password": password}}, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {accessToken,username};
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.user.data["username"];
  const isbn = req.params.isbn;
  const review = req.query.review;

  /**
   * We have to check if a book with the given ISBN exists.
   */
  if (books[isbn]) {
    if (review) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({message: "Successfully added/updated review"});
    }
  } else {
    return res.status(404).json({message: "Please provide a valid ISBN"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.user.data["username"];
  const isbn = req.params.isbn;

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Successfully deleted review"});
  } else {
    return res.status(404).json({message: "Cannot delete review for book with given ISBN"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
