const { Sequelize } = require("sequelize")
const config = require("./config")

const sequelize = new Sequelize(config.DB.NAME, config.DB.USER, config.DB.PASSWORD, {
  host: config.DB.HOST,
  port: config.DB.PORT,
  dialect: "postgres",
  logging: config.NODE_ENV === "development" ? console.log : false,
  dialectOptions: {
    ssl:
      config.NODE_ENV === "production"
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  timezone: "+00:00", // UTC
})

const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log("Database connection established successfully.")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

testConnection()

module.exports = sequelize
