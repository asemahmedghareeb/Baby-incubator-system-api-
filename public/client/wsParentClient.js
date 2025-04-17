const getWSURL = () => {
  const api_domain = window.location.host;
  let protocol
  if (api_domain.split(':')[0] === 'localhost') {
    protocol = 'ws';
  } else {
    protocol = 'wss';
  }
  return `${protocol}://${api_domain}`;
}

const socket = new WebSocket(getWSURL());

const authorize = () => {
  const message = JSON.stringify({
    type: 'authorization',
    token: localStorage.getItem('userAuthToken'),
  });
  socket.send(message);
}

socket.addEventListener("open", () => { 
  authorize();
});

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log(message);
};
