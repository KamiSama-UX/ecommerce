const validate = require('../middlewares/validate.middleware');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation');
const {
  authenticate,
  authorizeRoles,
} = require('../middlewares/auth.middleware');

router.post('/register', authValidation.registerValidation, validate, authController.register);
router.post('/login', authValidation.loginValidation, validate, authController.login);
router.put('/change-password', authenticate, authController.changePassword);
module.exports = router;