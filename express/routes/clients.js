const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers')

async function getAll(req, res) {
    const clients = await models.client.findAll();
    res.status(200).json(clients)
}

async function getById(req, res) {
    const id = getIdParam(req);
    const client = await models.client.findById(id);

    if (client) {
        res.status(200).json(client);
    } else {
        res.status(400).send('404 - Not found')
    }
} 

async function getByTutorEmail(req, res) {
    let email = decodeURIComponent(req.params.email)
    const clients = await models.client.findAll({
        where: { 
            tutorEmail: email
        }
    });
    res.status(200).json(clients);
}


async function create(req, res) {
    if (req.body.id) {
        res.status(400).send('Bad request: ID should not be provided, since it is determined automatically by the database.')
    } else {
        
        // This is for checking if the email is already in use

        emailInUse = await models.client.findOne({
            where: { email: req.body.email }
        }).catch((err) => {
           res.status(500).send(err.message)
        })
        
        // send different responses based on check above

        if (emailInUse) {
            res.status(500).send('Email already in use')
        } else {
            const newObj = await models.client.create(req.body).catch((err) => {
                res.status(500).json({'Error': err, 'Stack': err.stack}).end();
            })

            res.status(201).json(newObj);
        }
    }
}


async function update(req, res) {
    const id = getIdParam(req);

    // We only accept update requests if the 'id:' param matches the body 'id'
    if (id === req.body.id) {
        await models.client.update(req.body, {
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
    await models.client.destroy({
        where: {
            id: req.params.id
        }
    });
    res.status(200).end();
}


module.exports = {
	getAll,
	getById,
	create,
	update,
	remove,
    getByTutorEmail
};