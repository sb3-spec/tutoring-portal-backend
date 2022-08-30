const { DataTypes } = require('sequelize');



module.exports = (sequelize) => {
    const Session = sequelize.define('session', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        length: {
            allowNull: false,
            type: DataTypes.DOUBLE
        },
        date: {
            defaultValue: new Date(),
            type: DataTypes.DATE
        },

        sessionCost: {
            allowNull: false,
            type: DataTypes.DOUBLE
        },

        hasBeenPaid: {
            defaultValue: false,
            type: DataTypes.BOOLEAN
        }
    })

    Session.associate = models => {
        Session.belongsTo(models.client);

    }

}