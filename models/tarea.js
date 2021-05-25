const { Schema, model } = require('mongoose');

const SubtareaSchema =  Schema({
    nombre: {
      type: String,
      require: true
    },
    descripcion: {
      type: String,
      require: true
    },
    status: { 
      type : Number, 
      default: 0
    }
  });


const TareaSchema =  Schema({
  id_proyecto: {
    type : Schema.Types.ObjectId, 
    ref: 'Proyecto'
  },
  nombre: {
    type: String,
    require: true
  },
  descripcion: {
    type: String,
    require: true
  },
  fecha_vencimiento: {
    type : Date,
    default: null
  },
  lista: { 
    type : Schema.Types.ObjectId, 
    ref: 'Lista'
  },
  cronometro: {
    type: Number,
    default: 0
  },
  miembro: { 
    type : Schema.Types.ObjectId, 
    ref: 'Usuario' 
  },
  subtareas: [{ 
    type : SubtareaSchema,
    default: [] 
  }],
  archivos: [{
      type: String,
      default: []
  }],
  etiquetas: [{
      type: String,
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


TareaSchema.method('toJSON', function() {
  const { __v, ...object } = this.toObject();
  return object;
})

//Esto hace que se cree la coleccion en la base de datos 
//@params nombre de la coleccion, estructura que va a tener
// no hay que poner el nombre de la collec en plural el lo hace
module.exports = model('Tarea', TareaSchema);