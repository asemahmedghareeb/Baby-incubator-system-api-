const reservationUpdate = {
  status: {
    notEmpty: {
      errorMessage: 'Reservation status should be not empty',
    },
    isIn: {
      options: [['confirmed', 'pending', 'cancelled']],
      errorMessage: 'Not available status option. \
Choose between: confirmed, pending, cancelled',
    },
  },
  incubatorId: {
    optional: true,
    isInt: {
      errorMessage: 'Id should be a number',
    },
    toInt: true,
  },
}

const hospitalId = {
  hospitalId: {
    isInt: {
      errorMessage: 'Id should be a number',
    },
    toInt: true,
  },
}

const reservationId = {
  reservationId: {
    isInt: {
      errorMessage: 'Id should be an integer number',
    },
    toInt: true,
  },
}


export {
  reservationUpdate,
  reservationId,
  hospitalId
}
