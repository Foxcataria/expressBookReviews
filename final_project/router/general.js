const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const axios = require('axios').default;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    return res.status(404).json({message: "Please provide a username"});
  } else if (!password) {
    return res.status(404).json({message: "Please provide a password"});
  }

  if (!doesExist(username)) {
    users.push({"username": username, "password": password});
    return res.status(200).json({message: "User successfully registred. Now you can login"});
  } else {
    return res.status(404).json({message: "User already exists!"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    return res.status(300).json({message: "No books found with the given ISBN"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  if (author) {
    const bookValues = Object.keys(books).map((key) => {
      return books[key];
    })
    let filteredBooks = bookValues.filter((book) => {
      return book.author == author;
    });
    return res.send(filteredBooks);
  } else {
    return res.status(300).json({message: "No books found with the given author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  if (title) {
    const bookValues = Object.keys(books).map((key) => {
      return books[key];
    })
    let filteredBooks = bookValues.filter((book) => {
      return book.title == title;
    });
    return res.send(filteredBooks);
  } else {
    return res.status(300).json({message: "No books found with the given title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (isbn) {
    return res.send(books[isbn]["reviews"]);
  } else {
    return res.status(300).json({message: "No reviews found with the given ISBN"});
  }
});

const doesExist = (username) => {
  let usersWithSameName = users.filter((user) => {
    return user.username == username;
  });

  if (usersWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * Code to get a list of all books by means of axios.
 */
axios.get('http://localhost:5001/')
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // DO NOTHING HERE!
  });

/**
 * Code to get book details based on ISBN by means of
 * axios.
 */
axios.get('http://localhost:5001/isbn/1')
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // DO NOTHING HERE!
  });

/**
 * Code to get book details based on author by means of
 * axios.
 */
axios.get('http://localhost:5001/author/Chinua Achebe')
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // DO NOTHING HERE
  });

/**
 * Code to get book details based on title by means of
 * axios.
 */
axios.get('http://localhost:5001/title/Things Fall Apart')
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // DO NOTHING HERE
  });

module.exports.general = public_users;
