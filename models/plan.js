const { Schema, model } = require('mongoose');
 
const PlanSchema =  Schema({

  nombre: {
    type: String,
    require: true
  },
  precio: {
    type: Number,
    require: true
  },
  max_tareas: {
    type: Number,
    require: true
  },
  max_miembros: { 
    type : Number, 
    require: true 
  },
  active: {
    type: Boolean,
    default: true
  }

});


PlanSchema.method('toJSON', function() {
  const { __v, ...object } = this.toObject();
  return object;
})

//Esto hace que se cree la coleccion en la base de datos 
//@params nombre de la coleccion, estructura que va a tener

module.exports = model('Plan', PlanSchema);