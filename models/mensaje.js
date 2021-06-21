const { Schema, model } = require("mongoose");

//Este va por ahora de prueba porque aqui se indica como se hace referencia
//a un id de otra coleccion
const MensajeSchema = Schema(
  {
    de: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      require: true,
    },
    para: {
      type: Schema.Types.ObjectId,
      ref: "Proyecto",
      require: true,
    },
    mensaje: {
      type: String,
      require: true,
    },
  },
  {
    //agregar fecha de creacion y fecha de modificacion
    timestamps: true,
  }
);

MensajeSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

//Esto hace que se cree la coleccion en la base de datos
//@params nombre de la coleccion, estructura que va a tener
// no hay que poner el nombre de la collec en plural el lo hace
module.exports = model("Mensaje", MensajeSchema);
