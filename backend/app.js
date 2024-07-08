const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
const Restauran = require("./models/Restauran.js");
const { authenticateToken } = require("./utils/isAuthorizated.js");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://abdullohqurbonov332:G3FYLzwM03pyAndQ@yelp.dsdfy9i.mongodb.net/?retryWrites=true&w=majority&appName=yelp"
  )
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });
const PORT = 8000;

app.get("/", (req, res) => {
  res.json({
    message: "success",
  });
});

app.post("/create-accaunt", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    if (!username) {
      return res.status(400).json({
        message: "Username is required",
        error: true,
      });
    }
    if (!email) {
      return res.status(400).json({
        error: true,
        message: "Email is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        error: true,
        message: "Password is required",
      });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
      return res.status(400).json({
        error: true,
        message: "email is already exist",
      });
    }
    const user = new User({
      username,
      email,
      password,
    });
    await user.save();

    const accessToken = jwt.sign({ user }, "yelpfullstack", {
      expiresIn: "1d",
    });

    return res.json({
      message: "User addedd successfuly",
      errro: false,
      user,
      accessToken,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      error: true,
      message: "An error occurred while creating the user",
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      error: true,
      message: "Email is required",
    });
  }
  if (!password) {
    return res.status(400).json({
      error: true,
      message: "PAsword is required",
    });
  }

  const isUser = await User.findOne({ email });

  if (!isUser) {
    return res.json({
      message: "User not found",
      error: true,
    });
  }
  if (isUser.password != password) {
    return res.status(401).json({
      message: "Invalid password",
      error: true,
    });
  }
  const user = {
    user: isUser,
  };

  const accessToken = jwt.sign(user, "yelpfullstack", {
    expiresIn: "1d",
  });

  return res.json({
    error: false,
    message: "Successfuly login",
    accessToken,
    user: isUser,
  });
});

app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.json({
      message: "Something went wrong",
      error: true,
    });
  }
  const { username, email, password } = isUser;

  return res.json({
    username,
    email,
    password,
  });
});

app.post("/add-restauran", authenticateToken, async (req, res) => {
  const { name, description } = req.body;
  const { user } = req.user;
  console.log(user);

  if (!name) {
    return res.status(400).json({
      error: true,
      message: "Name is required",
    });
  }

  if (!description) {
    return res.status(400).json({
      error: true,
      message: "Description is required",
    });
  }

  try {
    const restaurant = new Restauran({
      name,
      description,
      userId: user._id,
    });
    console.log(restaurant);
    await restaurant.save();
    return res.json({
      message: "Restaurant added successfully",
      error: false,
      restaurant,
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({
      error: true,
      message: "An error occurred while creating the restaurant",
    });
  }
});

app.get("/get-all-restauran", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const restaurants = await Restauran.find({ userId: user._id });

    return res.json({
      message: "All restaurants",
      error: false,
      restaurants,
    });
  } catch (error) {
    console.error("Error retrieving restaurants:", error);
    return res.status(500).json({
      error: true,
      message: "An error occurred while retrieving the restaurants",
    });
  }
});

app.delete("/delete-restauran/:id", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const restaurantId = req.params.id;

  try {
    const restaurant = await Restauran.findOneAndDelete({
      _id: restaurantId,
      userId: user._id,
    });
    if (!restaurant) {
      return res
        .status(404)
        .json({ error: true, message: "Restaurant not found" });
    }
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({
      error: true,
      message: "An error occurred while deleting the restaurant",
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server has been started on PORT: ${PORT}`);
})
