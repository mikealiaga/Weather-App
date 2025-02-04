import { Router } from 'express';
const router = Router();

import apiRoutes from './api/index.js';
import htmlRoutes from './htmlRoutes.js';

router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

router.get('/api/terms', (_req, res) => {
    res.json({ message: "Terms endpoint working!" });
});

export default router;
