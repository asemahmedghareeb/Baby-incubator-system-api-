const searchParams = {
  longitude: {
    optional: true,
    isFloat: {
      errorMessage: 'Longitude must be of the type double',
    },
    toFloat: true,
  },
  latitude: {
    optional: true,
    isFloat: {
      errorMessage: 'Latitude must be of the type double',
    },
    toFloat: true,
  },
  city: {
    optional: true,
    isString: {
      errorMessage: 'City must be a string',
    },
    escape: true,
  },
  cursor: {
    isInt: {
      errorMessage: 'Page number must be an integer',
    },
    toInt: true,
  },
}

export {
  searchParams
}
