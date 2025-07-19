const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role
      },
      token: result.token
    });
  } catch (err) {
    if (err.message === 'Email already registered') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: result.id,
        email: result.email,
        role: result.role
      },
      token: result.token
    });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const result = await authService.changePassword(req.body, req.user);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};