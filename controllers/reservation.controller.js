import express from 'express';
import { checkSchema } from 'express-validator';
import {
  reservationCreate,
  reservationUpdate,
  reservationId,
  userId
} from '../validation/reservation.validation.js';
import {
  validate
} from '../middlewares/validation.js';
import {
  authorizeParent
} from '../middlewares/authorization.js';
import {
  getReservations,
  deleteReservations,
  getUserReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation
} from '../services/reservation.service.js';


const router = express.Router();

/* Temporary */
router.get(
  '/all',
  getReservations
);

router.delete(
  '/delete_all',
  deleteReservations
);
/* Temporary */

router.get(
  '/',
  authorizeParent,
  checkSchema(userId),
  validate,
  getUserReservations
);

router.get(
  '/:reservationId',
  authorizeParent,
  checkSchema(userId),
  checkSchema(reservationId),
  validate,
  getReservation
);

router.post(
  '/',
  authorizeParent,
  checkSchema(userId),
  checkSchema(reservationCreate),
  validate,
  createReservation
);

router.patch(
  '/:reservationId',
  authorizeParent,
  checkSchema(userId),
  checkSchema(reservationId),
  checkSchema(reservationUpdate),
  validate,
  updateReservation
);

router.delete(
  '/:reservationId',
  authorizeParent,
  checkSchema(userId),
  checkSchema(reservationId),
  validate,
  deleteReservation
);


export default router;
