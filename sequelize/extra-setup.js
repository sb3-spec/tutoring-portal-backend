
async function applyExtraSetup(sequelize) {
    const { tutor, session, client } = sequelize.models

    // client
    client.hasMany(session)

    session.belongsTo(client)
    

    tutor.hasMany(client)


    client.belongsTo(tutor)

    await sequelize.sync({alter: true}).catch((err) => {
        console.log(err.message);
    })

}

module.exports = applyExtraSetup 