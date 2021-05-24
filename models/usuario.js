const { Schema, model } = require('mongoose');

//La estructura que va tener la coleccion usuario
const UsuarioSchema =  Schema({

  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  contrasena: {
    type: String,
    required: true,
  },
  onLine: {
    type: Boolean,
    default: false
  },
  //Se pone por defecto en true
  active: {
    type: Boolean,
    default: true
  },
  fechaNacimiento: {
    type: Date,
    required: true,
  },
});

//Esto es para que no devuelva la contrasena 
UsuarioSchema.method('toJSON', function() {
  const { __v, _id, contrasena, ...object } = this.toObject();
  object.uid = _id;
  return object;
})

//Esto hace que se cree la coleccion en la base de datos 
//@params nombre de la coleccion, estructura que va a tener
module.exports = model('Usuario', UsuarioSchema);