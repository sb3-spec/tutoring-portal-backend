const { DataTypes } = require('sequelize');



module.exports = (sequelize) => {
    const client = sequelize.define('client', {

        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        name: {
            allowNull: false,
            type: DataTypes.STRING
        },

        email: {
            allowNull: false,
            type: DataTypes.STRING,
        
        },

        
        rate: {
            allowNull: false,
            type: DataTypes.DOUBLE
        },
    })

    client.associate = models => {
        client.belongsTo(models.tutor);
    }

    client.associate = models => {
        client.hasMany(models.session, {
            foreignKey: {
                allowNull: false
            }
        });
    }
}