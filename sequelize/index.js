const { Sequelize } = require('sequelize');
const applyExtraSetup = require('./extra-setup')


const sequelize = new Sequelize('tutoring-portal-2', 'postgres', "Rkf7010zaqxsw!@#", {
    host: 'localhost',
    dialect: 'postgres',
    define: {
        freezeTableName: true,
    },
    logging: false,
})


const modelDefiners = [
    require('./models/client.model'),
    require('./models/tutor.model'),
    require('./models/session.model')
];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}


applyExtraSetup(sequelize);


module.exports = sequelize