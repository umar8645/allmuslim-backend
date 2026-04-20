import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js"

// Register Controller
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    const user = await User.create({ name, email, password })

    if (user) {
      const token = generateToken(user._id)
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      })
    } else {
      return res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    console.error("Register Error:", error.message)
    res.status(500).json({ message: "Server error during registration" })
  }
}

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" })
    }

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id)
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      })
    } else {
      return res.status(401).json({ message: "Invalid email or password" })
    }
  } catch (error) {
    console.error("Login Error:", error.message)
    res.status(500).json({ message: "Server error during login" })
  }
}
