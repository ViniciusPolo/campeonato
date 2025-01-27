const express = require('express')
const router = express.Router()

const gamesController = require ('../controllers/gamesController');

router.get('/games', gamesController.indexAll);

router.post('/games/add-new', gamesController.AddrandomGames);


module.exports = router