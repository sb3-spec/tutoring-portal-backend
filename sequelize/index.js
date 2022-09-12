const { Sequelize } = require('sequelize');
require('dotenv').config(); 

const applyExtraSetup = require('./extra-setup')


const sequelize = new Sequelize(
    process.env.NODE_ENV !== 'production' ? 'tutoring-portal-2' : process.env.PROD_DATABASE_NAME, 'postgres', 
    process.env.NODE_ENV !== 'production' ? "Rkf7010zaqxsw!@#" : process.env.PROD_DATABASE_NAME, 
    {
        host: process.env.NODE_ENV !== 'production' ?  'localhost': process.env.PROD_DATABASE_URL,
        dialect: 'postgres',
        define: {
            freezeTableName: true,
        },
        logging: false,
});


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