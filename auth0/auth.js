require('dotenv').config(); 


const config = {
	authRequired: true,
	auth0Logout: true,
	secret: process.env.SECRET,
	baseURL: processs.env.NODE_ENV === 'production' ? process.env.PRODUCTION_URL : process.env.DEVELOPMENT_URL,
	clientID: process.env.CLIENT_ID,
	issuerBaseURL: process.env.ISSUER_BASE_URL
  };

  
  module.exports = { config }