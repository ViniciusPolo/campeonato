const express = require('express')
const router = express.Router()

const tournamentController = require ('../controllers/tournamentController');

router.get('/tournament', tournamentController.indexAll);

router.post('/tournament/add-new', tournamentController.addNew);


module.exports = router