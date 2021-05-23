const mongoose = require('mongoose');

/**
 * @description: realiza la conexion a la base de datos
 */
const dbConnection = async() => {
  try {

    await mongoose.connect( process.env.DB_CNN_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    console.log("Conectado a la base de datos")

    
  } catch (error) {
    console.log(error);
    throw new Error('Error en la base de datos - vea logs');
  }
}

module.exports = {
  dbConnection
}