// seed.js
const mongoose = require("mongoose");
const categoryModel = require("../models/categoryModel");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const categories = [
  { categoryName: "Music Concert", icon: "🎵" },
  { categoryName: "Sport Product", icon: "⚽" },
  { categoryName: "Seminar/Workshop", icon: "🎤" },
  { categoryName: "Art Exhibition", icon: "🎨" },
  { categoryName: "Food Carnival", icon: "🍔" },
  { categoryName: "Tech Conference", icon: "💻" },
  { categoryName: "Fashion Show", icon: "👗" },
  { categoryName: "Career Fair", icon: "💼" },
  { categoryName: "Hackathon", icon: "👨‍💻" },
  { categoryName: "Product Launch", icon: "📦" },
  { categoryName: "Wedding", icon: "💍" },
  { categoryName: "Birthday Party", icon: "🎂" },
  { categoryName: "Anniversary Celebration", icon: "💑" },
  { categoryName: "Baby Shower", icon: "👶" },
];

categoryModel
  .insertMany(categories)
  .then(() => {
    console.log("Categories added");
    mongoose.disconnect();
  })
  .catch((err) => console.error(err));
