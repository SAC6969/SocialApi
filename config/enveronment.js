
const production = {
    name: 'production',
    assets_path: process.env.assets_path,
    session_cookie_key: process.env.session_cookie_key,
    db: 'codeial_developments',
    smtp: {
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.user, // generated ethereal user
          pass: process.env.pass, // generated ethereal password
        },
    },
    google_client_ID: process.env.google_client_ID,
    google_client_clientSecret: process.env.google_client_clientSecret,
    google_callbackURL: process.env.google_callbackURL,
    jwt_secret: process.env.jwt_secret
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT)