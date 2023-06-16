//session based login 
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5050;
const secretKey = "your-secret-key";
   
// Middleware to parse JSON in request body
app.use(express.json());

// User data (dummy data for demonstration)
const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find user in the user data
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    // Generate JWT token
    const token = jwt.sign({ userId: user.id, username }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Protected route
app.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Protected route accessed" });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      // Set user information in the request object
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: "Token not provided" });
  }
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});




