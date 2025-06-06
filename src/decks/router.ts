import { Router } from "express";
import { createDeck, deletDeck, getDeckById, getDecks } from "./controller";


const router = Router();

router.get("/", getDecks);
router.get('/:id', getDeckById);
router.post("/", createDeck);
router.delete('/:id', deletDeck);

export default router;