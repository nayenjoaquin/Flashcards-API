import { Request, Response, Router } from "express";
import { createDeck, deleteDeck, getDeckById, getDecks, updateDeck } from "./controller";
import { searchDeck } from "./search/controller";


const router = Router();

router.get("/",(req: Request, res: Response)=>{
    const {search} = req.query
    if(search){
        return searchDeck(req, res);
    }
    return getDecks(req, res)
});
router.get('/:id', getDeckById);
router.post("/", createDeck);
router.delete('/:id', deleteDeck);
router.patch('/:id', updateDeck);

export default router;