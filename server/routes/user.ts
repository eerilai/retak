import { Router } from "express";
import { getUserGames, getUserData, getCurrentUserGames } from "../../database/queries";

const router = Router();

router.get("/:username/data", async (req, res) => {
    const data = await getUserData(req.params.username);
    res.json(data);
});

router.get("/:username/games", async (req, res) => {
    const games = await getUserGames(req.params.username);
    res.json(games);
});

router.get("/:userId/games/current", async (req, res) => {
    const games = await getCurrentUserGames(req.params.userId);
    res.json(games);
});

export default router;