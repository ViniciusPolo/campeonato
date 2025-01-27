const Teams = require('../database/models/teams');

module.exports = {
    async indexAll(req, res) {
        try {
            const teams = await Teams.findAll()
            return res.json(teams)
        } catch (err) {
            return res.status(400).send('Broked ->' + err)
        }
    },
        
    async addNew(req, res) {
        try {
            const name = req.body.name
            const teams = await Teams.create({
                name
            })
            return res.status(200).send({
                status: 1,
                message: "Team sucessefull included",
                teams
              })
        } catch (error) {
            return res.status(400).send(error)
        }
    },

}