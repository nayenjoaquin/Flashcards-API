import { Router } from "express";
import { saveSession } from "./controller";


const router = Router();

router.post('/', saveSession);

export default router