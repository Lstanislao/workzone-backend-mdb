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
        msg: "El correo ya existe"
      })
    }else if( userValidation?.username  === username){
      return res.status(400).json({
        ok: false,
        msg: "El username ya existe"
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
      usuario,
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
      usuario: usuarioDB,
      //token: token 
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
      usuario
 
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
  getUsuarioByEmail
}