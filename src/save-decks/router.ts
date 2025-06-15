import { Router } from "express";
import { getMyDecks, saveDeck } from "./controller";


const router = Router();

router.post('/:deck_id', saveDeck);
router.get('/', getMyDecks);


export default router;