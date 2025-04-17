import express from 'express';
import { checkSchema } from 'express-validator';
import { searchParams } from '../validation/search.schema.js';
import { userId } from '../validation/user.validation.js';
import { validate } from '../middlewares/validation.js';
import { authorizeParent } from '../middlewares/authorization.js';
import { searchHospital } from '../services/search.service.js';


const router = express.Router();

router.get(
  '/',
  authorizeParent,
  checkSchema(userId, ['body']),
  checkSchema(searchParams, ['query']),
  validate,
  searchHospital
);


export default router;
