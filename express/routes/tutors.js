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



async function getTutorClients(req, res) {
    let encryptedText = decodeURIComponent(req.params.email);
    let email = CryptoJS.AES.decrypt(encryptedText, 'test').toString(CryptoJS.enc.Utf8);

    console.log(email)

    let tutor = await models.tutor.findOne({ 
        where: { email: email }
    }).catch(err => {
        res.status(500).json({'Error': err.message}).end();
    });

    if (!tutor) {
        return res.status(400).json({error: "Invalid Email Address"});
    }
    
    let clients = [];
    await tutor.getClients().then((res) => {
        clients = res
        console.log('Clients fetched successfully');
    }).catch(err => {
        res.status(500).json({error: err});
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

async function getSessions(req, res) {
    let encryptedText = decodeURIComponent(req.params.email);
    let email = CryptoJS.AES.decrypt(encryptedText, 'test').toString(CryptoJS.enc.Utf8);

    let uriDecodedDate = decodeURIComponent(req.params.date);
    let dateInfo = uriDecodedDate.split('-');
    let start = new Date(dateInfo[0], dateInfo[1] - 1, 1);
    let end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

    let tutor = {};

    await models.tutor.findOne({ 
        where: { 
            email: email,
        }
    }).then((res) => {
        tutor = res
    }).catch(err => {
        return res.status(500).json({'Error': err.message});
    });


    if (!tutor) {
        return res.status(400).json({error: "Invalid Email Address"});
    };
    

    let clients = await tutor.getClients().catch(err => {

        res.status(500).json({error: err.message});
    });

    let sessions = [];

    for (let client of clients) {
        let newSessions = await client.getSessions({
            order: [['date', 'DESC']],

            // where: {
            //     date: {
            //         $gte: start, 
            //         $lt: end
            //     }
            // }
        }).catch(err => {
            res.status(500).json({error: "Error getting client sessions"});
            return;
        });

        sessions = sessions.concat(newSessions);
    }
    sessions.sort((first, second) => {
        if (first.date > second.date) {
            return -1;
        }

        if (first.date < second.date) {
            return 1;
        }
        return 0;
    });

    

    sessions = sessions.filter((session) => {
        return (session.date >= start && session.date < end);
    });
    console.log(`Start: ${start}`)
    console.log(`End: ${end}`)

    res.json(sessions);
    
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
    getTutorClients,
    getSessions
};