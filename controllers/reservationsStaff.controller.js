import express from 'express';
import { checkSchema } from 'express-validator';
import {
  reservationUpdate,
  reservationId,
  hospitalId
} from '../validation/reservationsStaff.validation.js';
import {
  validate
} from '../middlewares/validation.js';
import {
  authorizeHospitalOrStaff
} from '../middlewares/authorization.js';
import {
  getHospitalReservations,
  updateReservation
} from '../services/reservationsStaff.service.js';


const router = express.Router();

router.get(
  '/',
  authorizeHospitalOrStaff,
  checkSchema(hospitalId),
  validate,
  getHospitalReservations
);

router.patch(
  '/:reservationId',
  authorizeHospitalOrStaff,
  checkSchema(hospitalId),
  checkSchema(reservationId),
  checkSchema(reservationUpdate),
  validate,
  updateReservation
);


export default router;
