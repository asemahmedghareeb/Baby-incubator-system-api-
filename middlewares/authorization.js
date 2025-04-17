import jwt from 'jsonwebtoken';
import {
  unauthorizedHandler,
  forbiddenHandler,
  internalErrorHandler
} from './errorHandlers.js';


export function authorizeParent(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return unauthorizedHandler(res);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const requiredRole = 'parent';
    if (decoded.role === requiredRole) {
      req.body.userId = decoded.id;
      next();
    } else {
      return forbiddenHandler(res);
    }
  } catch (err) {
    if (err.message === 'invalid signature') {
      return unauthorizedHandler(res);
    } else {
      console.error(err.message);
      return internalErrorHandler(res);
    }
  }
}

export function authorizeHospital(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return unauthorizedHandler(res);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const requiredRole = 'hospital';
    if (decoded.role === requiredRole) {
      req.body.hospitalId = decoded.id;
      next();
    } else {
      return forbiddenHandler(res);
    }
  } catch (err) {
    if (err.message === 'invalid signature') {
      return unauthorizedHandler(res);
    } else {
      console.error(err.message);
      return internalErrorHandler(res);
    }
  }
}

export function authorizeStaff(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return unauthorizedHandler(res);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const requiredRole = 'staff';
    if (decoded.role === requiredRole) {
      req.body.staffMemberId = decoded.id;
      req.body.hospitalId = decoded.hospitalId;
      next();
    } else {
      return forbiddenHandler(res);
    }
  } catch (err) {
    if (err.message === 'invalid signature') {
      return unauthorizedHandler(res);
    } else {
      console.error(err.message);
      return internalErrorHandler(res);
    }
  }
}

export function authorizeHospitalOrStaff(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return unauthorizedHandler(res);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const requiredRoles = ['staff', 'hospital'];
    if (requiredRoles.includes(decoded.role)) {
      if (decoded.role === 'hospital') {
        req.body.hospitalId = decoded.id;
      } else if (decoded.role === 'staff') {
        req.body.hospitalId = decoded.hospitalId;
      }
      next();
    } else {
      return forbiddenHandler(res);
    }
  } catch (err) {
    if (err.message === 'invalid signature') {
      return unauthorizedHandler(res);
    } else {
      console.error(err.message);
      return internalErrorHandler(res);
    }
  }
}
