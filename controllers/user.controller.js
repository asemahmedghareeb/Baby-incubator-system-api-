import express from 'express';
import { checkSchema } from 'express-validator';
import {
  userId,
  userSignup,
  userLogin,
  userProfileUpdate
} from '../validation/user.validation.js';
import { validate } from '../middlewares/validation.js';
import { authorizeParent } from '../middlewares/authorization.js';
import {
  getUsers,
  getUser,
  createUser,
  authenticateUser,
  updateUser,
  deleteUser
} from '../services/user.service.js';


const router = express.Router();

/* Temporary Route */
router.get(
  '/all',
  getUsers
);
/* Temporary Route */

router.get(
  '/',
  authorizeParent,
  checkSchema(userId),
  validate,
  getUser
);

router.post(
  '/signup',
  checkSchema(userSignup),
  validate,
  createUser
);

router.post(
  '/login',
  checkSchema(userLogin),
  validate,
  authenticateUser
);

router.patch(
  '/',
  authorizeParent,
  checkSchema(userId),
  checkSchema(userProfileUpdate),
  validate,
  updateUser
);

router.delete(
  '/',
  authorizeParent,
  checkSchema(userId),
  validate,
  deleteUser
);


export default router;
