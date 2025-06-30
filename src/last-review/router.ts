import { Router } from "express";
import { getLastReview } from "./controller";


const router = Router();

router.get('/', getLastReview);

export default router