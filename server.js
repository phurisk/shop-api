const cors = require("cors");
const express = require("express");
const shopRoutes = require("./routes/shopRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Shop Management API is running");
});


app.use("/api", shopRoutes);
app.use("/api", productRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

