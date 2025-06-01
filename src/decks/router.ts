import { Router } from "express";
import { createDeck, getDeckById, getDecks } from "./controller";


const router = Router();

router.get("/", getDecks);
router.get('/:id', getDeckById);
router.post("/", createDeck);

export default router;