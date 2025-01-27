const express = require('express')
const router = express.Router()

const teamsController = require ('../controllers/teamsController');

router.get('/teams', teamsController.indexAll);

router.post('/teams/add-new', teamsController.addNew);


module.exports = router