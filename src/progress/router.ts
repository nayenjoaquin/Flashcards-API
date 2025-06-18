import { Router } from "express";
import { getProgress, updateProgress } from "./controller";

const router = Router();

router.put('/:card_id', updateProgress);
router.get('/:deck_id', getProgress);

export default router;