const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");
const usuario = require("../models/usuario");


const createUsuario = async (req, res = response) => {
  try {

    const { email, contrasena, username } =  req.body;
    console.log(req.body);
    
    //validar que el correo ni el username ya esten registrados
    const userValidation = await Usuario.findOne({
      $or: [
            { email : email },
            { username: username }
          ]
    })

    if( userValidation?.email  === email ){
      return res.status(400).json({
        ok: false,
        msg: "El correo usado ya se encuentra registrado"
      })
    }else if( userValidation?.username  === username){
      return res.status(400).json({
        ok: false,
        msg: "El username usado ya se encuentra registrado. Se más creativo e inventate uno mejor!"
      })
    }

    //se crea instancia del modelo
    const usuario =  new Usuario(req.body);

    //Incriptar la contrasena
    const salt = bcrypt.genSaltSync();
    usuario.contrasena = bcrypt.hashSync( contrasena, salt )

    //guardar en la base de datos
    usuario.save();

    //generar jwt
    //const token  = await generarJWT(usuario.id);

    //lo que devuelve si se guarda
    res.json({
      ok: true,
      data: usuario,
      //token
    })

    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'La peticion de crear usuario fallo'
    })
  }
}


/**
 * @description:al hacer login, se busca correo y se verifica que la contrasena sean iguales
 * @param: email, contrasena
 */
const login = async (req, res = response) => {
  try {

    const { email, contrasena, username } =  req.body;

    //buscar el usuario con ese correo
    const usuarioDB = await Usuario.findOne({ email });

    if(!usuarioDB){
      return res.status(404).json({
        ok: false,
        msg: 'Email no encontrado'
      })
    };

    //comparar la contrasena incriptada con la eviada por el usuario
    const validPassword = bcrypt.compareSync(contrasena, usuarioDB.contrasena);
    if(!validPassword){
      return res.status(404).json({
        ok: false,
        msg: 'Credenciales invalidas'
      })
    };

    //generar el jwt
    //const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      data: usuarioDB,
      //token: token 
    });

    Usuario.findByIdAndUpdate(usuarioDB._id ,{onLine : true},
      function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("online usuario", docs);
        }
      });

    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'La peticion de crear usuario fallo'
    })
  }
}

/**
 * 
 * @description actualiza los datos de un usuario
 * @param mandale el uid y los datos que deseas actualizar del user
 */
const updateUsuario = async (req, res = response) => {
  try {
    console.log(req.body)
   
    const { uid } =  req.body;

    const usuario =  new Usuario(
      Usuario.findByIdAndUpdate(uid ,{...req.body},
      function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Actualizado el usuario", docs);
        }
      }));

  res.json({
      ok: true,
      data: usuario,
      
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'La peticion de actualizar'
    })
  }
}


/**
 * @description: Renueva el token de la sesion
 * @param: uid , userID
 */
const renewToken = async (req, res = response) => {
    const uid = req.uid;

    //Gnerar nuevo JWT 
    //const token = await generarJWT( uid );

    //obtener el usuario por uid
    const usuario =  await Usuario.findById(uid);

    res.json({
      ok: true,
      //token,
      data: usuario
 
    })
    
} 

/**
 * @description: devuelve un usuario dado el email
 * @param: email
 * No es una peticion de utiliza internamente en el servidor
 */
const getUsuarioByEmail = async (email) => {

    const user = await Usuario.findOne({email : email })
    console.log(user);
    return user;
    
} 


module.exports =  {
  createUsuario,
  login,
  renewToken,
  getUsuarioByEmail,
  updateUsuario
}