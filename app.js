const WebSocketServer = require('websocket').server;
const http = require('http');

const port = process.env['PORT'] || process.env['APP_PORT'] || 5000;

const server = http.createServer(function (request, response) {
  console.log((new Date()) + ' | Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(port, function () {
  console.log((new Date()) + ' | Server is listening on port ' + port);
});

wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  return true;
}


function handleJoin(msg, cb) {
  if(!msg.hasOwnProperty('nickname') && !msg.hasOwnProperty('sent')) {
    msg.connection.sendUTF(JSON.stringify({status: 400, message: 'Missing argument'}));
  } else {
    msg.connection.sendUTF(JSON.stringify({
      type: msg.type,
      success: true,
      nickname: msg.nickname,
      sent: msg.sent})
    );
  }
}

function handleCM(msg, cb) {
  if(!msg.hasOwnProperty('text')) {
    msg.connection.sendUTF(JSON.stringify({status: 400, message: 'Missing argument'}));
  } else {
    msg.connection.sendUTF(JSON.stringify({
      type: msg.type,
      message: msg.text,
      nickname: msg.nickname,
      sent: msg.sent})
    );
  }
}

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log((new Date()) + ' | Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  let connection = request.accept('hsc-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');

  connection.on('message', function (message) {

    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);

      let data = JSON.parse(message.utf8Data);

      // Check if message type is available
      if(!data.hasOwnProperty('type')) {
        connection.sendUTF(JSON.stringify({status: 400, message: 'Not so okayish'}));
      }

      data.connection = connection;

      // Check
      switch(data.type) {
        case 'join':
         handleJoin(data);
         break;
        case 'message':
          handleCM(data);
          break;
        default:
          connection.sendUTF(message.utf8Data);
      }
    }
  });

  connection.on('close', function (reasonCode, description) {
    console.log((new Date()) + ' | Peer ' + connection.remoteAddress + ' disconnected with code ' + reasonCode + ' - ' + description);
  });
});