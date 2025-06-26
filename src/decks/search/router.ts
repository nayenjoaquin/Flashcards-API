import { Router } from "express";
import { searchDeck } from "./controller";

const router = Router();

router.get('/', searchDeck)


export default router;