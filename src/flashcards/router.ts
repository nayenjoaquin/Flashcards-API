import { Router } from "express";
import { createCard, getFlashcards } from "./controller";


const router = Router();

router.get("/", getFlashcards);
router.post("/", createCard)

export default router;