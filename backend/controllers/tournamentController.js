const Tournament = require('../database/models/tournament');

module.exports = {
    async indexAll(req, res) {
        try {
            const tournament = await Tournament.findAll()
            return res.json(tournament)
        } catch (err) {
            return res.status(400).send('Broked ->' + err)
        }
    },

    async indexOne(req, res) {
        try {
            const tournament = await Tournament.findAll()
            return res.json(tournament)
        } catch (err) {
            return res.status(400).send('Broked ->' + err)
        }
    },
        
    async addNew(req, res) {
        try {
            const name = req.body.name
            const tournament = await Tournament.create({
                name
            })
            return res.status(200).send({
                status: 1,
                message: "Tournament sucessefull included",
                tournament
              })
        } catch (error) {
            return res.status(400).send(error)
        }
    },

}