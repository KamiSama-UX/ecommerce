const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.registerUser = async (data) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // Step 1: Extract input
    const { name, email, password, role = "customer" } = data;

    // Step 2: Validate required fields
    const requiredFields = ["name", "email", "password"];
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Step 3: Check if email already exists
    const [[existing]] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing) {
      throw new Error("Email already registered");
    }

    // Step 4: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5: Insert user
    const [result] = await connection.execute(
      `INSERT INTO users (name, email, password_hash, role, is_verified) 
       VALUES (?, ?, ?, ?, 0)`,
      [name, email, hashedPassword, role]
    );

    const userId = result.insertId;

    // Step 6: Generate JWT token
    const token = jwt.sign(
      { id: userId, email, role, token_version: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Step 7: Finalize
    await connection.commit();
    connection.release();

    return {
      id: userId,
      name,
      email,
      role,
      token,
    };
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
};

exports.loginUser = async (data) => {
  const { email, password } = data;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // Step 1: Find user by email
    const [[user]] = await connection.execute(
      "SELECT id, email, password_hash, role FROM users WHERE email = ?",
      [email]
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Step 2: Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Step 3: Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, token_version: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Step 4: Finalize
    await connection.commit();
    connection.release();

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      token,
    };
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
};

exports.changePassword = async (data, decoded) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // Step 1: Validate user
    const { id: userId } = decoded;
    const { currentPassword, newPassword } = data;

    const [[user]] = await connection.execute(
      "SELECT id, password_hash FROM users WHERE id = ?",
      [userId]
    );

    if (!user) {
      throw new Error("User not found");
    }

    // Step 2: Validate current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    // Step 3: Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Step 4: Update password in DB
    await connection.execute(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [hashedPassword, userId]
    );

    // Step 5: Finalize
    await connection.commit();
    connection.release();

    return { message: "Password updated successfully" };
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
};
