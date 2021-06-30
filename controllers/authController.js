const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const usuario = require("../models/usuario");
const nodemailer = require("nodemailer");

/**
 * @description:crea usuario y valida si ese correo y username ya existe
 * @param: email, contrasena, username, fechaNacimiento, nombre, apellido
 */
const createUsuario = async (req, res = response) => {
  try {
    const { email, contrasena, username } = req.body;
    console.log(req.body);

    //validar que el correo ni el username ya esten registrados
    const userValidation = await Usuario.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (userValidation?.email === email) {
      return res.status(400).json({
        ok: false,
        msg: "El correo usado ya se encuentra registrado",
      });
    } else if (userValidation?.username === username) {
      return res.status(400).json({
        ok: false,
        msg: "El username usado ya se encuentra registrado. Se más creativo e inventate uno mejor!",
      });
    }

    //se crea instancia del modelo
    const usuario = new Usuario(req.body);

    //Incriptar la contrasena
    const salt = bcrypt.genSaltSync();
    usuario.contrasena = bcrypt.hashSync(contrasena, salt);

    //guardar en la base de datos
    usuario.save();

    //generar jwt
    const token = await generarJWT(usuario.id);

    //lo que devuelve si se guarda
    res.json({
      ok: true,
      data: usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "La peticion de crear usuario fallo",
    });
  }
};

/**
 * @description: busca todos los usuarios activos
 */
const getUsuarios = async (req, res = response) => {
  try {
    const usuarios = await Usuario.find({ active: true });

    console.log(usuarios);

    res.json({
      ok: true,
      data: usuarios,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "La peticion de buscar usuario fallo",
    });
  }
};

/**
 * @description:al hacer login, se busca correo y se verifica que la contrasena sean iguales
 * @param: email, contrasena
 */
const login = async (req, res = response) => {
  try {
    const { email, contrasena, username } = req.body;

    //buscar el usuario con ese correo
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    //comparar la contrasena incriptada con la eviada por el usuario
    const validPassword = bcrypt.compareSync(contrasena, usuarioDB.contrasena);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "Credenciales invalidas",
      });
    }

    //generar el jwt
    const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      data: usuarioDB,
      token: token,
    });

    Usuario.findByIdAndUpdate(
      usuarioDB._id,
      { onLine: true },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("online usuario", docs);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "La peticion de crear usuario fallo",
    });
  }
};

/**
 *
 * @description actualiza los datos de un usuario
 * @param mandale el uid y los datos que deseas actualizar del user
 */
const updateUsuario = async (req, res = response) => {
  try {
    console.log(req.body);

    const { uid } = req.body;

    const usuario = new Usuario(
      Usuario.findByIdAndUpdate(uid, { ...req.body }, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Actualizado el usuario", docs);
        }
      })
    );

    res.json({
      ok: true,
      data: usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "La peticion de actualizar",
    });
  }
};

/**
 * @description: Renueva el token de la sesion
 * @param: uid , userID
 */
const renewToken = async (req, res = response) => {
  const uid = req.uid;

  //Gnerar nuevo JWT
  const token = await generarJWT(uid);

  //obtener el usuario por uid
  const usuario = await Usuario.findById(uid);

  res.json({
    ok: true,
    token,
    data: usuario,
  });
};

/**
 * @description: devuelve un usuario dado el id
 * @param: id usuario
 */
const getUsuario = async (req, res = response) => {
  try {
    console.log(req.params.user);
    const uid = req.params.user;

    const usuario = await Usuario.findById(uid);

    console.log(usuario);

    res.json({
      ok: true,
      data: usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "La peticion de buscar usuario fallo",
    });
  }
};

/**
 * @description: devuelve un usuario dado el email
 * @param: email
 * No es una peticion se utiliza internamente en el servidor
 */
const getUsuarioByEmail = async (email) => {
  const user = await Usuario.findOne({ email: email });
  console.log(user);
  return user;
};

/**
 * @description: manda correo con contrasena provisional por si el usuario la olvida
 * @param: email
 */
const recuperarContrasena = async (req, res = response) => {
  try {
    const { email } = req.body;
    console.log(req.body);
    //buscar el usuario con ese correo
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }
    console.log(usuarioDB);

    //datos para enviar el correo
    let transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: "workzonetrial@gmail.com",
        pass: "workzone123456",
      },
    });

    //contrasena provisional
    let contraseProvisional =
      usuarioDB.username + Math.floor(Math.random() * (999 - 100 + 1) + 100);

    const salt = bcrypt.genSaltSync();
    console.log(usuarioDB);
    usuarioDB.contrasena = bcrypt.hashSync(contraseProvisional, salt);
    console.log(usuarioDB);

    //enviar correo con contra provisional
    transporter
      .sendMail({
        from: "workzonetrial@gmail.com",
        to: usuarioDB.email,
        subject: "Recuperación de contraña Workzone",
        html: `<h3>Estimado usuario,</h3><p style="font-size: 16px;">Su contraseña es: <strong>${contraseProvisional}</strong> . 
    Por favor ingrese a su cuenta con esta contraseña provisional y cambie la contraseña</p>`,
      })
      .then((res) => console.log("successfully sent that mail"))
      .catch((err) => console.log(err));

    usuario.findByIdAndUpdate(
      usuarioDB._id,
      { ...usuarioDB },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Actualizada la contrasena del usuario", docs);
        }
      }
    );

    res.json({
      ok: true,
      data: usuarioDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "La peticion de recuperar contraseña fallo",
    });
  }
};

/**
 * @description: cambia la contraseña
 * @param: id y nueva contrasena
 */
const resetearContrasena = async (req, res = response) => {
  try {
    const { id, contrasena } = req.body;
    console.log(req.body);
    const usuarioDB = await Usuario.findById(id);
    const salt = bcrypt.genSaltSync();
    usuarioDB.contrasena = bcrypt.hashSync(contrasena, salt);

    usuario.findByIdAndUpdate(
      usuarioDB._id,
      { ...usuarioDB },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Actualizada la contrasena del usuario", docs);
        }
      }
    );

    res.json({
      ok: true,
      data: usuarioDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "La peticion de resear contraseña fallo",
    });
  }
};

module.exports = {
  createUsuario,
  login,
  renewToken,
  getUsuarioByEmail,
  updateUsuario,
  getUsuarios,
  recuperarContrasena,
  getUsuario,
  resetearContrasena,
};

// const getUsuarioByEmail = async (email) => {
//   const user = await Usuario.findOne({ email: email });
//   console.log(user);
//   return user;
// };

// const recuperarContrasena = async (req, res = response) => {
//  try {
//     const { email, contrasena, username } = req.body;
//     console.log(req.body)
//     //buscar el usuario con ese correo
//     const usuarioDB = await Usuario.findOne({ email });

//     if (!usuarioDB) {
//       return res.status(404).json({
//         ok: false,
//         msg: "Email no encontrado",
//       });
//     }
//     console.log(usuarioDB);

//     if(usuarioDB.username =  username){

//       const salt = bcrypt.genSaltSync();
//       console.log(usuarioDB)
//       usuarioDB.contrasena = bcrypt.hashSync(contrasena, salt);
//       console.log(usuarioDB)
//       Usuario.findByIdAndUpdate(usuarioDB._id, { ...usuarioDB }, function (err, docs) {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("Actualizado el usuario", docs);
//         }
//       })
//     }

//     res.json({
//       ok: true,
//       data: usuarioDB,
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       ok: false,
//       msg: "La peticion de crear usuario fallo",
//     });
//   }
// };
