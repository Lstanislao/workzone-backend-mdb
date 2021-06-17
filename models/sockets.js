const {
  conectarUsuario,
  desconectarUsuario,
  getUsuariosChat,
  getProyectosIds,
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
        console.log(proyecto.toString());
        socket.join(proyecto.toString());
      });

      this.io.emit("lista-usuarios", await getUsuariosChat(uid));
      //el to es el socket o el salon y el emit es al canal donde voy a escuchar
      socket.on("refresh-project", (payload) => {
        console.log(payload.id_proyecto.toString());
        this.io
          .to(payload.id_proyecto.toString())
          .emit("refresh", { chao: "chao" });
      });

      console.log("cliente conectado", usuario.username);

      socket.on("disconnect", async () => {
        console.log("cliente desconectado", uid);
        await desconectarUsuario(uid);
        this.io.emit("lista-usuarios", await getUsuariosChat(uid));
      });
    });
  }
}

module.exports = Sockets;
