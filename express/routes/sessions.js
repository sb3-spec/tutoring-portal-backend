const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers')

async function getAll(req, res) {
    const sessions = await models.session.findAll();
    res.status(200).json(sessions);
}

async function getByTutorId(req, res) {
    const sessions = await models.session.findAll({
        where: { 
            tutorId: req.params.tutorId 
        }
    });
    res.status(200).json(sessions);
}

async function getById(req, res) {
    const id = getIdParam(req);
    const session = await models.session.findById(id);

    if (session) {
        res.status(200).json(session);
    } else {
        res.status(400).send('404 - Not found');
    }
} 


async function create(req, res) {
    if (req.body.id) {
        res.status(400).send('Bad request: ID should not be provided, since it is determined automatically by the database.')
    } else {
        const newSession = await models.session.create(req.body).catch((err) => {
            res.status(500).json({'Error': err, 'Stack': err.stack})
        })
        res.status(201).json(newSession);
    }
}


async function update(req, res) {
    const id = getIdParam(req);

    // We only accept update requests if the 'id:' param matches the body 'id'
    if (id === req.body.id) {
        await models.session.update(req.body, {
            where: {
                id:id
            }
        })
        res.status(200).end();
    } else {
        res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id})`);
    }
};

async function remove(req, res) {

    if (!req.params.id) {
        res.status(404).json({error: 'No id provided'}).end();
    }
    await models.session.destroy({
        where: {
            uuid: req.params.id
        }
    });
    res.status(200).json(req.params.id);
}


module.exports = {
	getAll,
	getById,
	create,
	update,
	remove,
    getByTutorId
};