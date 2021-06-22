const {
  conectarUsuario,
  desconectarUsuario,
  getUsuariosChat,
  getProyectosIds,
  saveMensaje,
} = require("../controllers/socketController");
const { comprobarJWT } = require("../helpers/jwt");

class Sockets {
  constructor(io) {
    this.io = io;

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", async (socket) => {
      //el token viene con el socket lo extraigo y lo verifico para saber quien se conecto
      const [valido, uid] = comprobarJWT(socket.handshake.query["x-token"]);

      if (!valido) {
        console.log("socket no identificado");
        return socket.disconnect();
      }

      const usuario = await conectarUsuario(uid);

      const proyectos = await getProyectosIds(uid);

      proyectos.forEach((proyecto) => {
        socket.join(proyecto.toString());
      });

      socket.join(uid.toString());

      this.io
        .to(uid.toString())
        .emit("lista-usuarios", await getUsuariosChat(uid));

      //el to es el socket o el salon y el emit es al canal donde voy a escuchar

      //indicar que hubo cambio en el board por lo tanto se le tiene que actualizar a todos los qde ese proyecto
      socket.on("refresh-project", (payload) => {
        console.log(payload.id_proyecto.toString());
        this.io
          .to(payload.id_proyecto.toString())
          .emit("refresh", { id_proyecto: payload.id_proyecto.toString() });
      });

      socket.on("refresh-chat", async (payload) => {
        console.log(uid.toString(), "AAAAAAAAAAAAAAAAA");
        this.io
          .to(uid.toString())
          .emit("lista-usuarios", await getUsuariosChat(uid));
      });

      socket.on("mensaje", async (payload) => {
        const mensaje = await saveMensaje(payload);
        this.io.to(payload.para).emit("mensaje", mensaje);
        console.log(mensaje);
        //this.io.to(payload.de).emit("mensaje-personal", mensaje);
      });

      console.log("cliente conectado", usuario.username);

      socket.on("disconnect", async () => {
        console.log("cliente desconectado", uid);
        await desconectarUsuario(uid);
        //this.io.emit("lista-usuarios", await getUsuariosChat(uid));
      });
    });
  }
}

module.exports = Sockets;
