import { Router } from "express";
import { getDecks } from "./controller";


const router = Router();

router.get("/",getDecks);

export default router;