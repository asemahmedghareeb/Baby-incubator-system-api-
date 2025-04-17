export const userId = {
  userId: {
    isInt: {
      errorMessage: 'Not a valid number',
    },
    toInt: true,
  },
}

export const userSignup = {
  name: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isString: {
      errorMessage: 'Not a valid string',
    },
  },
  email: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isEmail: {
      errorMessage: 'Not a valid email format',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isString: {
      errorMessage: 'Not a valid string',
    },
    isLength: {
      options: { min: 8, max: 50 },
      errorMessage: 'Characters should be between 8 and 50 characters',
    },
  },
  nationalId: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isString: {
      errorMessage: 'Not a valid string',
    },
    isNumeric: {
      errorMessage: 'Should contains only numbers',
    },
    isLength: {
      options: { min: 14, max: 14 },
      errorMessage: 'Should be 14 characters',
    },
  },
  phoneNumber: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isString: {
      errorMessage: 'Not a valid string',
    },
    isMobilePhone: {
      errorMessage: 'Not a valid phone number',
    },
    isLength: {
      options: { min: 11, max: 11 },
      errorMessage: 'Should be 11 characters',
    },
  },
  city: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isString: {
      errorMessage: 'Not a valid string',
    },
    isLength: {
      options: { max: 50 },
      errorMessage: 'Should not exceed 50 characters',
    },
  },
  address: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isString: {
      errorMessage: 'Not a valid string',
    },
    isLength: {
      options: { max: 50 },
      errorMessage: 'Should not exceed 50 characters',
    },
  },
  longitude: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isFloat: {
      errorMessage: 'Not a valid floating point number',
    },
    toFloat: true,
  },
  latitude: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isFloat: {
      errorMessage: 'Not a valid floating point number',
    },
    toFloat: true,
  },
  accuracy: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isFloat: {
      errorMessage: 'Not a valid floating point number',
    },
    toFloat: true,
  },
};

export const userLogin = {
  email: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isEmail: {
      errorMessage: 'Not a valid email format',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'Should be not empty',
    },
    isString: {
      errorMessage: 'Not a valid string',
    },
    isLength: {
      options: { min: 8, max: 50 },
      errorMessage: 'Characters should be between 8 and 50 characters',
    },
  },
};

export const userProfileUpdate = structuredClone(userSignup);
Object.keys(userProfileUpdate).forEach(key => {
  userProfileUpdate[key].optional = true;
});
