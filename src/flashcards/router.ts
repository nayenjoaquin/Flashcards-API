import { Router } from "express";
import { createCard, deleteCard, getFlashcards } from "./controller";


const router = Router();

router.get("/", getFlashcards);
router.post("/", createCard);
router.delete("/:id", deleteCard);

export default router;