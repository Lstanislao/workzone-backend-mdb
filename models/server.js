// Servidor de Express
const express  = require('express');
const http     = require('http');
const socketio = require('socket.io');
const path     = require('path');
const cors     = require('cors');

const Sockets  = require('./sockets');
const { dbConnection } = require('../database/config');

/**
 * @description: aqui se crea el servidor y todo lo necesario para correrlo
 */
class Server {

    constructor() {

        this.app  = express();
        this.port = process.env.PORT;

        //Contectar a db
        dbConnection();

        // Http server esto es parte de sockets
        this.server = http.createServer( this.app );
        
        // Configuraciones de sockets
        this.io = socketio( this.server, { /* configuraciones */ } );
    }

    middlewares() {
        // Desplegar el directorio público
        this.app.use( express.static( path.resolve( __dirname, '../public' ) ) );

        //cors
        this.app.use( cors() );

        //pasar todo lo que venga a json TODO hay que hacer si vamos a recibir archivos el otro format
        this.app.use( express.json() )

        //Rutas
        this.app.use('/api/auth', require('../router/authRoutes'));
        this.app.use('/api/projects', require('../router/proyectoRoutes'));
        this.app.use('/api/tasks', require('../router/tareaRoutes'));
    
    }

    // Esta configuración se puede tener aquí o como propieda de clase
    // depende mucho de lo que necesites
    configurarSockets() {
        new Sockets( this.io );
    }

    execute() {

        // Inicializar Middlewares
        this.middlewares();

        // Inicializar sockets
        this.configurarSockets();

        // Inicializar Server
        this.server.listen( this.port, () => {
            console.log('Server corriendo en puerto:', this.port );
        });
    }

}


module.exports = Server;