import { Router } from "express";
import { createUser, signIn } from "./controller";


const router = Router();

router.post('/sign-up', createUser);
router.post('/sign-in', signIn);

export default router