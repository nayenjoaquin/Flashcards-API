import { Router } from "express";
import { getFlashcards } from "./controller";


const router = Router();

router.get("/", getFlashcards);

export default router;