import { Router } from 'express';
import { loadGameData, saveGameData } from '../controllers/game.controller.js';
import { getUser } from '../middleware/getUser.js';

const router = Router();

// To save the game Data
router.post('/save', getUser, saveGameData);

router.get('/save', getUser, loadGameData);

export default router;
