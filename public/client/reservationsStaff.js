const getURL = () => {
  const api_domain = window.location.host;
  let protocol
  if (api_domain.split(':')[0] === 'localhost') {
    protocol = 'http';
  } else {
    protocol = 'https';
  }
  return `${protocol}://${api_domain}`;
}

const getReservations = async () => {
  const url = `${getURL()}/hospital/reservations`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('staffAuthToken'),
    },
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result;
  } catch (err) {
    console.error(err);
  }
}

const updateReservation = async (reservationId, status) => {
  const url = `${getURL()}/hospital/reservations/${reservationId}`;
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('staffAuthToken'),
    },
    body: JSON.stringify({ status }),
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (result.error) {
      throw new Error(result.error.message);
    }

    window.location.reload();
  } catch (err) {
    console.error(err);
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  const reservationsContainer = document.getElementById('reservations');
  const response = await getReservations();
  const reservations = response.hospitalReservations;

  reservations.map((reservation) => {
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
  });
});
