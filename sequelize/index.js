const { Sequelize } = require('sequelize');
require('dotenv').config(); 

const applyExtraSetup = require('./extra-setup')


const sequelize = new Sequelize(
    process.env.NODE_ENV !== 'production' ? 'tutoring-portal-2' : process.env.DATABASE_URI, 
    process.env.NODE_ENV !== 'production' ? 'postgres' : process.env.DATABASE_USER, 
    process.env.NODE_ENV !== 'production' ? "Rkf7010zaqxsw!@#" : process.env.DATABASE_PASSWORD, 
    {
        host: process.env.NODE_ENV !== 'production' ?  'localhost': process.env.DATABASE_HOST,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        },
        define: {
            freezeTableName: true,
        },
        logging: false,
    }
);


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