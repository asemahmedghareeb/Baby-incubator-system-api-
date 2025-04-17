import express from 'express';
import { checkSchema } from 'express-validator';
import {
  hospitalId,
  hospitalSignup,
  hospitalLogin,
  hospitalProfileUpdate
} from '../validation/hospital.validation.js';
import { validate } from '../middlewares/validation.js';
import { authorizeHospital } from '../middlewares/authorization.js';
import {
  getHospitals,
  getHospital,
  createHospital,
  authenticateHospital,
  updateHospital,
  deleteHospital
} from '../services/hospital.service.js';


const router = express.Router();

/* Temporary route for testing purposes */
router.get(
  '/all',
  getHospitals
);
/* Temporary route for testing purposes */

router.get(
  '/',
  authorizeHospital,
  checkSchema(hospitalId),
  validate,
  getHospital
);

router.post(
  '/signup',
  checkSchema(hospitalSignup),
  validate,
  createHospital
);

router.post(
  '/login',
  checkSchema(hospitalLogin),
  validate,
  authenticateHospital
);

router.patch(
  '/',
  authorizeHospital,
  checkSchema(hospitalId),
  checkSchema(hospitalProfileUpdate),
  validate,
  updateHospital
);


router.delete(
  '/',
  authorizeHospital,
  checkSchema(hospitalId),
  validate,
  deleteHospital
);


export default router;
