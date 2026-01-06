import express from 'express';
import {
  login,
  logout,
  onboard,
  signup,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post('/onboarding', protectRoute, onboard);

//check if user is logged in or not
router.get('/checkAuth', protectRoute, (req, res) => {
  res
    .status(200)
    .json({
      success: true,
      message: 'You are currently logged in',
      user: req.user,
    });
});

export default router;
