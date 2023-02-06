const express = require("express");
const exphbs = require("express-handlebars");
const restaurantsData = require("./restaurant.json").results;
const mongoose = require('mongoose')

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const port = 3000;

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { restaurantsData });
});

app.get("/search", (req, res) => {
  if (!req.query.keywords) {
    return res.redirect("/");
  }

  const keywords = req.query.keywords;
  const keyword = req.query.keywords.trim().toLowerCase(); 

  const filterRestaurantsData = restaurantsData.filter(
    (data) =>
      data.name.toLowerCase().includes(keyword) ||
      data.category.includes(keyword)
  );

  res.render("index", { restaurantsData: filterRestaurantsData, keywords });
});

app.get("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  const restaurantData = restaurantsData.find(
    (data) => data.id === Number(restaurantId)
  );
  res.render("show", { restaurantData });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
