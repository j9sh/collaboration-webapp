import { io } from 'socket.io-client';

const config = require('./config.json');

export const socket = io(`http://localhost:${config.SERVER_PORT_NUMBER}`);