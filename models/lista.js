const { Schema, model } = require('mongoose');
 
const ListaSchema =  Schema({
  id_proyecto: {
    type : Schema.Types.ObjectId, 
    ref: 'Proyecto'
  },
  nombre: {
    type: String,
    require: true
  },
  items: [{ 
    type : Schema.Types.ObjectId, 
    ref: 'Tarea',
    default: [] 
  }],
  active: {
    type: Boolean,
    default: true
  }

});


ListaSchema.method('toJSON', function() {
  const { __v, ...object } = this.toObject();
  return object;
})

//Esto hace que se cree la coleccion en la base de datos 
//@params nombre de la coleccion, estructura que va a tener

module.exports = model('Lista', ListaSchema);