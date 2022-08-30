const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { join } = require("path");
const { makeHandlerAwareOfAsyncErrors } = require('./helpers');

const app = express();


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


// ROUTES
const routes = {
    tutors: require('./routes/tutors'),
    clients: require('./routes/clients'),
    sessions: require('./routes/sessions')
};



app.get('/auth_config.json', (req, res) => {
	res.sendFile(join(__dirname, 'auth_config.json'))
});



// API ROUTES
for (const [routeName, routeController] of Object.entries(routes)) {
	if (routeController.getAll) {
		app.get(
			`/api/${routeName}`,
			makeHandlerAwareOfAsyncErrors(routeController.getAll)
		);
	};
	if (routeController.getClients) {
		app.get(`/api/tutors/clients/:email`,
			makeHandlerAwareOfAsyncErrors(routeController.getClients)
		);
		
	};
	if (routeController.getByTutorEmail) {
		app.get(`/api/${routeName}/:email`, 
		makeHandlerAwareOfAsyncErrors(routeController.getByTutorEmail));
		
	}
	if (routeController.getByEmail) {
		app.get(`/api/${routeName}/email/:email`),
		makeHandlerAwareOfAsyncErrors(routeController.getByEmail)
	};
	if (routeController.getByTutorId) {
		app.get(
			`/api/${routeName}/:tutorId`,
			makeHandlerAwareOfAsyncErrors(routeController.getByTutorId)
		)
	};
	if (routeController.getById) {
		app.get(
			`/api/${routeName}/:id`,
			makeHandlerAwareOfAsyncErrors(routeController.getById)
		);
	};
	if (routeController.create) {
		app.post(
			`/api/${routeName}`,
			makeHandlerAwareOfAsyncErrors(routeController.create)
		);
	};
	if (routeController.update) {
		app.put(
			`/api/${routeName}/:id`,
			makeHandlerAwareOfAsyncErrors(routeController.update)
		);
	};
	if (routeController.remove) {
		app.delete(
			`/api/${routeName}/:id`,
			makeHandlerAwareOfAsyncErrors(routeController.remove)
		);
	};
}

module.exports = app;