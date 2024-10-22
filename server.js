import { WebSocketServer } from 'ws'; // WebSocketServer로 가져옴

// WebSocket 서버 생성 (포트 8080)
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('클라이언트가 연결되었습니다.');

  ws.on('message', (message) => {
    console.log(`받은 메시지: ${message}`);
    ws.send(`서버에서 받은 메시지: ${message}`);
  });

  ws.on('close', () => {
    console.log('클라이언트 연결이 종료되었습니다.');
  });
});

console.log('WebSocket 서버가 포트 8080에서 실행 중입니다.');
