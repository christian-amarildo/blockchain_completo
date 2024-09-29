const axios = require("axios").default;

exports.getLogin = (req, res, next) => {
  res.render("login", {
    title: "Entrar",
    cssPath: "css/login.css",
  });
};

exports.postLogin = async (req, res, next) => {
  // Collects data from html login form
  const username = req.body.username;
  const org = req.body.org;

  // Groups the data
  let data = {
    username,
    org
  };

  // Data to JSON
  const jsonData = JSON.stringify(data);

  // Set url and headers
  const url = "http://localhost:4000/auth/register";
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // HTTP POST request
  axios
    .post(url, jsonData, options)
    .then(function (response) {
      // if the user has successfully logged in, stores user jwt and username info in session
      req.session.username = username;
      req.session.org = org;
      req.session.jwt = response.data;
      res.json({ success: true, token: response.data });
    })

    // If an error occurs, redirect to the login page and send error message
    .catch(function (err) {
      res.json({ success: false, err: err.response.data.message });
    });
};

exports.getMint = (req, res, next) => {
  res.render("mint", {
    title: "Emitir",
    cssPath: "css/mint.css",
  });
};

exports.getTransfer = (req, res, next) => {
  res.render("transfer", {
    title: "Transferir",
    cssPath: "css/transfer.css",
  });
};

exports.getSelfBalance = async (req, res, next) => {
  res.render("selfBalance", {
    title: "Saldo",
    cssPath: "css/balance.css",
  });
};

exports.getBalance = async (req, res, next) => {
  res.render("balance", {
    title: "Consultar saldo",
    cssPath: "css/balance.css",
  });
};

exports.getSelfCollection = async (req, res, next) => {
    res.render("selfCollection", {
      title: "Coleção",
      cssPath: "css/collection.css",
    });
};

exports.getCollection = async (req, res, next) => {
    res.render("collection", {
      title: "Consultar coleção",
      cssPath: "css/collection.css",
    });
};

exports.getLogout = (req, res, next) => {
  // jwt and username info stored in session to null

  req.session.token = null;
  req.session.username = null;
  // req.session.destroy();
  res.redirect("/");
};