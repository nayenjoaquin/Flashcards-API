import { Router } from "express";
import { createCard, deleteCard, getFlashcards, updateCard } from "./controller";


const router = Router();

router.get("/", getFlashcards);
router.post("/", createCard);
router.delete("/:id", deleteCard);
router.patch('/:id', updateCard);

export default router;