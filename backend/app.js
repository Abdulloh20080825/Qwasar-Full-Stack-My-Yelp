const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // bcrypt is needed for password hashing
const User = require("./models/User.js");
const Restauran = require("./models/Restauran.js"); // Changed to Restaurant for consistency
const { authenticateToken } = require("./utils/isAuthorizated.js");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.json({
    message: "success",
  });
});

app.post("/create-account", async (req, res) => {
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
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

    const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      message: "User added successfully",
      error: false,
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
      message: "Password is required",
    });
  }

  const isUser = await User.findOne({ email });

  if (!isUser) {
    return res.json({
      message: "User not found",
      error: true,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, isUser.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid password",
      error: true,
    });
  }

  const user = {
    user: isUser,
  };

  const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res.json({
    error: false,
    message: "Successfully logged in",
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
    const restauran = new Restauran({
      name,
      description,
      userId: user._id,
    });
    console.log(restauran);
    await restauran.save();
    return res.json({
      message: "Restaurant added successfully",
      error: false,
      restauran,
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({
      error: true,
      message: "An error occurred while creating the restaurant",
    });
  }
});

app.get("/get-all-restaurans", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const restaurans = await Restauran.find({ userId: user._id });

    return res.json({
      message: "All restaurants",
      error: false,
      restaurans,
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
  const restauranId = req.params.id;

  try {
    const restauran = await Restauran.findOneAndDelete({
      _id: restauranId,
      userId: user._id,
    });
    if (!restauran) {
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
});
