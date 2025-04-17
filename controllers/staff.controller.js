import express from 'express';
import { checkSchema } from 'express-validator';
import { hospitalId } from '../validation/hospital.validation.js';
import {
  staffMemberId,
  staffMemberSignup,
  staffMemberLogin,
  staffMemberProfileUpdate
} from '../validation/staff.validation.js';
import { validate } from '../middlewares/validation.js';
import {
  authorizeHospital,
  authorizeStaff
} from '../middlewares/authorization.js';
import {
  getStaff,
  getHospitalStaff,
  getStaffMember,
  checkStaffMemberEmail,
  createStaffMember,
  authenticateStaffMember,
  updateStaffMember,
  deleteStaffMember,
} from '../services/staff.service.js';


const router = express.Router();

/* Temporary Route */
router.get(
  '/all',
  getStaff
);
/* Temporary Route */

router.get(
  '/',
  authorizeHospital,
  checkSchema(hospitalId),
  validate,
  getHospitalStaff
);

router.get(
  '/member',
  authorizeStaff,
  checkSchema(hospitalId),
  checkSchema(staffMemberId),
  validate,
  getStaffMember
);

router.get(
  '/:staffMemberId',
  authorizeHospital,
  checkSchema(hospitalId),
  checkSchema(staffMemberId),
  validate,
  getStaffMember
);

router.post(
  '/signup',
  authorizeHospital,
  checkSchema(hospitalId),
  checkSchema(staffMemberSignup),
  validate,
  //checkStaffMemberEmail,
  createStaffMember
);

router.post(
  '/login',
  checkSchema(staffMemberLogin),
  validate,
  authenticateStaffMember
);

router.patch(
  '/:staffMemberId',
  authorizeHospital,
  checkSchema(hospitalId),
  checkSchema(staffMemberId),
  checkSchema(staffMemberProfileUpdate),
  validate,
  //checkStaffMemberEmail,
  updateStaffMember
);

router.delete(
  '/:staffMemberId',
  authorizeHospital,
  checkSchema(hospitalId),
  checkSchema(staffMemberId),
  validate,
  deleteStaffMember
);


export default router;
