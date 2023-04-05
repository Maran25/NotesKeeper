const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const userRoute = require("./routes/userRoutes");
const noteRoute = require("./routes/noteRoutes");
const { auth } = require("./middlewear/auth");


app.use(cors({
  origin: 'http://127.0.0.1:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/note", auth, noteRoute);

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(app.listen(PORT, () => console.log(`listening on port ${PORT}`)))
  .then(console.log("Connected to Database"))
  .catch((err) => console.error(err.message));

