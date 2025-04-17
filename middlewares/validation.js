import {
  validationResult,
} from 'express-validator';


export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    next()
  } else {
    res.status(400).json({
      error: {
        message: result.array()[0].msg,
        field: result.array()[0].path,
        code: 400
      }
    });
  }
}
