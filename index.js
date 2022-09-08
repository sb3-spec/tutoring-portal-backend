const app = require('./express/app')
const sequelize = require('./sequelize')
const PORT = 5000;

async function setUpDB() {
    console.log('Checking database connection...')
    await sequelize.authenticate().then(() => {
        console.log("Connection Successful")
    }).catch((err) => {
        console.log("Error: " + err)
    })
}

async function init() {
    await setUpDB()

	app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}. Try some routes, such as '/api/sessions'.`);
	});
}

init();