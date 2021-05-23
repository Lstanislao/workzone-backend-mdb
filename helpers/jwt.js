const jwt =  require('jsonwebtoken');


//genera token del usuario es como una validacion de la seccion de usuario
// lo hice porque creo que sera necesario para los sockets
const generarJWT = (uid) => {

  return new Promise( (resolve ,reject) => {

    const payload = {uid};

    jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: '24h'
    }, (err, token) => {

      if(err){
        console.log(err);
        reject('No se pudo generar el token');
      }else {
        resolve(token);
      }
    })
  });



}

module.exports = {
  generarJWT
}