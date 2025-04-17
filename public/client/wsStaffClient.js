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
const reservationsContainer = document.getElementById('reservations');

const authorize = () => {
  const message = JSON.stringify({
    type: 'authorization',
    token: localStorage.getItem('staffAuthToken'),
  });
  socket.send(message);
}

socket.addEventListener("open", () => { 
  authorize();
});

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'newReservation') {
    const reservation = data.reservation;
    const reservationNode = document.createElement('tr');
    const reservationIdNode = document.createElement('td');
    const reservationStatusNode = document.createElement('td');

    reservationNode.setAttribute('id', reservation.id);
    reservationNode.addEventListener('click', () => {
      updateReservation(reservation.id, 'confirmed');
    });
    reservationNode.appendChild(reservationIdNode);
    reservationNode.appendChild(reservationStatusNode);
    reservationIdNode.textContent = reservation.id;
    reservationStatusNode.textContent = reservation.status;
    reservationsContainer.appendChild(reservationNode);
  } else {
    console.log(data);
  }
};
