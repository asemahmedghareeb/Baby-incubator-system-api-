export const incubatorId = {
  incubatorId: {
    isInt: {
      errorMessage: 'Incubator ID must be an integer value',
    },
    toInt: true,
  },
}

export const incubatorCreate = {
  name: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isString: {
      errorMessage: 'Not a valid string',
    },
    escape: true,
  },
  type: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isString: {
      errorMessage: 'Should be a string',
    },
    escape: true,
  },
  status: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isIn: {
      options: [['available', 'pending', 'reserved']],
      errorMessage: 'Not available status option. \
Choose between: available, pending, reserved.',
    },
  },
  rentPerDay: {
    isFloat: {
      errorMessage: 'Not a valid floating point number',
    },
    toFloat: true,
  },
}

export const incubatorUpdate = structuredClone(incubatorCreate);
Object.keys(incubatorUpdate).forEach(key => {
  incubatorUpdate[key].optional = true;
});
