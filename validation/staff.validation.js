export const staffMemberId = {
  staffMemberId: {
    isInt: {
      errorMessage: 'Not a valid number',
    },
    toInt: true,
  },
};

export const staffMemberSignup = {
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
};

export const staffMemberLogin = {
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

export const staffMemberProfileUpdate = structuredClone(staffMemberSignup);
Object.keys(staffMemberProfileUpdate).forEach(key => {
  staffMemberProfileUpdate[key].optional = true;
});
