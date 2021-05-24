const { Schema, model } = require('mongoose');

//Este va por ahora de prueba porque aqui se indica como se hace referencia 
//a un id de otra coleccion 
const ProyectoSchema =  Schema({

  nombre: {
    type: String,
    require: true
  },
  descripcion: {
    type: String,
    require: true
  },
  plan: {
    type : Schema.Types.ObjectId, 
    ref: 'Plan' 
  },
  owner: { 
    type : Schema.Types.ObjectId, 
    ref: 'Usuario' 
  },
  archivado: {
    type: Boolean,
    default: false
  },
  miembros: [{ 
    type : Schema.Types.ObjectId, 
    ref: 'Usuario' 
  }],
  lideres: [{ 
    type : Schema.Types.ObjectId, 
    ref: 'Usuario' 
  }],
  etiquetas: [{ 
    type : String, 
    default: [] 
  }],
  active: {
    type: Boolean,
    default: true
  }

},{
  //agregar fecha de creacion y fecha de modificacion
  timestamps: true
});


ProyectoSchema.method('toJSON', function() {
  const { __v, ...object } = this.toObject();
  return object;
})

//Esto hace que se cree la coleccion en la base de datos 
//@params nombre de la coleccion, estructura que va a tener
// no hay que poner el nombre de la collec en plural el lo hace
module.exports = model('Proyecto', ProyectoSchema);