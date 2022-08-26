const express = require('express');
const app = express();
const axios = require('axios');
const { numberToDayOfWeek } = require('./public/scripts/numberToDayOfWeek.js');
// const { addToCart } = require('./public/scripts/addToCart.js');

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'))
// use res.render to load up an ejs view file

function getItems() {
  return axios.get('https://noodles-world-api.herokuapp.com/items');
}

function getHours() {
  return axios.get('https://noodles-world-api.herokuapp.com/hours');
}

function getResturants() {
  return axios.get('https://noodles-world-api.herokuapp.com/resturants');
}
// index page
app.get('/', function (req, res) {
  Promise.all([getItems(), getHours(), getResturants()])
    .then(function (results) {
      const items = results[0];
      const hours = results[1];
      const resturants = results[2];
      res.render("pages/index", {
        items: items.data,
        hours: hours.data,
        resturants: resturants.data,
        numberToDayOfWeek: numberToDayOfWeek,
        // addToCart: addToCart,
      });
    })
    .catch(function (error) {
      // handle errors appropriately
      res.render("error", { error });
    });
})

// about page
app.get('/about', function (req, res) {
  res.render('pages/about');
});

app.listen(8080);
console.log('Server is listening on port 8080');