import express from 'express';
import { checkSchema } from 'express-validator';
import { hospitalId } from '../validation/hospital.validation.js';
import {
  incubatorId,
  incubatorCreate,
  incubatorUpdate
} from '../validation/incubator.validation.js';
import { validate } from '../middlewares/validation.js';
import {
  authorizeHospitalOrStaff
} from '../middlewares/authorization.js';
import {
  getIncubators,
  getHospitalIncubators,
  getIncubator,
  createIncubator,
  updateIncubator,
  deleteIncubator,
  checkIncubatorName
} from '../services/incubator.service.js';


const router = express.Router();

/* Temporary Route */
router.get(
  '/all',
  getIncubators
);
/* Temporary Route */

router.get(
  '/',
  authorizeHospitalOrStaff,
  checkSchema(hospitalId),
  validate,
  getHospitalIncubators
);

router.get(
  '/:incubatorId',
  authorizeHospitalOrStaff,
  checkSchema(hospitalId),
  checkSchema(incubatorId),
  validate,
  getIncubator
);

router.post(
  '/',
  authorizeHospitalOrStaff,
  checkSchema(hospitalId),
  checkSchema(incubatorCreate),
  validate,
  checkIncubatorName,
  createIncubator
);

router.patch(
  '/:incubatorId',
  authorizeHospitalOrStaff,
  checkSchema(hospitalId),
  checkSchema(incubatorId),
  checkSchema(incubatorUpdate),
  validate,
  checkIncubatorName,
  updateIncubator
);

router.delete(
  '/:incubatorId',
  authorizeHospitalOrStaff,
  checkSchema(hospitalId),
  checkSchema(incubatorId),
  validate,
  deleteIncubator
);


export default router;
