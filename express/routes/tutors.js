const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers')
const CryptoJS = require('crypto-js');

async function getAll(req, res) {
    const tutors = await models.tutor.findAll();
    res.status(200).json(tutors)
}

async function getById(req, res) {
    const id = getIdParam(req);
    const tutor = await models.tutor.findByPk(id);

    if (tutor) {
        res.status(200).json(tutor);
    } else {
        res.status(400).send('404 - Not found')
    }
} 

async function getClients(req, res) {
    let encryptedText = decodeURIComponent(req.params.email);
    let email = CryptoJS.AES.decrypt(encryptedText, 'test').toString(CryptoJS.enc.Utf8);

    console.log('Email: ', email)

    let tutor = await models.tutor.findOne({ 
        where: { email: email }
    }).catch(err => {
        res.status(500).json({'Error': err.message}).end();
    });

    if (!tutor) {
        res.status(400).json({error: "Invalid Email Address"}).end()
    }

    let clients = await tutor.getClients().catch(err => {
        res.status(500).json({error: err.message}).end();
    });
    res.json(clients);
};

async function getByEmail(req, res) {
    let email = decodeURI(req.params.email);
    const tutor = await models.tutor.findOne({ 
        where: {
            email: email 
        }  
    });
    
    if (tutor) {
        res.status(200).json(tutor);
    } else {
        res.status(400).send('404 - Not found')
    }
}

async function create(req, res) {

    if (req.body.id) {
        res.status(400).send('Bad request: ID should not be provided, since it is determined automatically by the database.')
    } else {
        
        // This is for checking if the email is already in use

        emailInUse = await models.tutor.findOne({
            where: { email: req.body.email }
        }).catch((err) => {
            res.status(500).send(err.message)
        })

        // send different responses based on check above
        
        if (emailInUse) {

            res.status(400).json({error: 'Email already in use'});
        } else {

            const newTutor = await models.tutor.create(req.body).catch((err) => {
                res.status(400).json({error: err, stackError: err.stack})
            })
            res.status(201).json(newTutor).end();
        }

        
            
            
    }
}


async function update(req, res) {
    const id = getIdParam(req);

    // We only accept update requests if the 'id:' param matches the body 'id'
    if (id === req.body.id) {
        await models.tutor.update(req.body, {
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

    await models.tutor.destroy({
        where: {
            id: req.body.id
        }
    });
    res.status(200).json('Tutoring account successfully deleted').end();
}


module.exports = {
	getAll,
	getById,
	create,
	update,
	remove,
    getByEmail,
    getClients
};