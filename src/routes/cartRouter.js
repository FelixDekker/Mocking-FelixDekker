import express from 'express';
import cartController from '../controllers/cart.controller.mjs';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/create', cartController.createCart);
router.get('/get/:uid', cartController.getCart);
router.post('/add/:uid/:pid', cartController.addItemToCart);
router.delete('/remove/:uid/:pid', cartController.removeItemFromCart);
router.delete('/clear/:uid', cartController.clearCart);

router.post('/carts', async (req, res) => {
  const newCart = new Cart({
    userId: req.user._id,
    items: [],
    total: 0,
  });

  await newCart.save();

  res.status(201).json(newCart);
});

export default router;
