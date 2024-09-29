const axios = require("axios").default;

exports.createCar = (req, res, next) => {
  // Collects data from html form
  const data =req.body 

  // Data to JSON
  const jsonData = JSON.stringify(data);

  // Set url and headers
  const url = "http://localhost:4000/invoke/channels/channel1/chaincodes/chaincode/createCar";
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // HTTP POST request
  axios
    .post(url, jsonData, options)
    .then(function (response) {
      req.flash("success", "Carro criado com sucesso");
      res.redirect(`/`);
      
    })

    // If an error occurs, redirect to the login page and send error message
    .catch(function (err) {
      req.flash("error", err.response.data.message);
      res.redirect("/");
    });
};

exports.getCar = (req, res, next) => {
  const id =req.body.id 

  // Set url and headers
  const url = "http://localhost:4000/query/channels/channel1/chaincodes/chaincode/getCar?id="+id;

  // HTTP GET request
  axios
    .get(url)
    .then(function (response) {
      req.flash("success", "Carro consultado com sucesso");
      res.redirect(`/?owner=${response.data.result.owner}&make=${response.data.result.make}&model=${response.data.result.model}&colour=${response.data.result.colour}`);
    })

    // If an error occurs, redirect to the login page and send error message
    .catch(function (err) {
      console.log(err)
      req.flash("error", err.response.data.message);
      res.redirect("/");
    });
};

