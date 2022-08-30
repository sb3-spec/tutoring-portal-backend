const { DataTypes } = require('sequelize');



module.exports = (sequelize) => {
    const Tutor = sequelize.define('tutor', {
        firstName: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        lastName: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING,
            primaryKey: true,
        },
    });

    Tutor.associate = models => {
        Tutor.hasMany(models.client, {
            foreignKey: {
                name: 'tutorEmail',
                allowNull: false
            }
        })
    }
};

