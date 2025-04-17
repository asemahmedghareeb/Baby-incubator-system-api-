export function notFoundHandler(res) {
  return res.status(404).json({
  error: {
      message: 'Not Found',
      code: 404
    }
  });
}

export function internalErrorHandler(res) {
  return res.status(500).json({
    error: {
      message: 'Internal Server Error',
      code: 500
    }
  });
}

export function conflictErrorHandler(res, field) {
  return res.status(409).json({
    error: {
      message: 'Conflict. Already taken.',
      field: field,
      code: 409
    }
  });
}

export function unauthorizedHandler(res) {
  return res.status(401).json({
    error: {
      message: 'Unauthorized',
      code: 401
    }
  });
}

export function forbiddenHandler(res) {
  return res.status(403).json({
    error: {
      message: 'Forbidden',
      code: 403
    }
  });
}
