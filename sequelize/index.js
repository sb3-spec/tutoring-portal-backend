const { Sequelize } = require('sequelize');
require('dotenv').config(); 

const applyExtraSetup = require('./extra-setup')

console.log(process.env.DATABASE_HOST)
console.log(process.env.DATABASE_URI)
console.log(process.env.DATABASE_USER)
console.log(process.env.DATABASE_PASSWORD)
const sequelize = new Sequelize(process.env.DATABASE_URI, {
        // host: process.env.NODE_ENV !== 'production' ?  'localhost': process.env.DATABASE_HOST,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
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