import { Router } from "express";
import { deleteSaved, getMyDecks, saveDeck } from "./controller";


const router = Router();

router.post('/:deck_id', saveDeck);
router.delete('/:deck_id', deleteSaved);
router.get('/', getMyDecks);


export default router;