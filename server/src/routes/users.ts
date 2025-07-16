import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Users endpoint' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `User ${req.params.id} endpoint` });
});

export default router;