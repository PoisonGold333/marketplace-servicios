import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Messages endpoint' });
});

export default router;