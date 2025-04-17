import { PrismaClient } from '@prisma/client';
import { matchedData } from 'express-validator';
import {
  notFoundHandler,
  internalErrorHandler,
  conflictErrorHandler
} from '../middlewares/errorHandlers.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();

async function getStaff(req, res) {
  const staff = await prisma.hospitalStaff.findMany();

  res.status(200).json({ staff });
}

async function getHospitalStaff(req, res) {
  const { hospitalId } = matchedData(req);

  const hospitalStaff = await prisma.hospitalStaff.findMany({
    where: { hospital_id: hospitalId },
  });

  res.status(200).json({ hospitalStaff });
}

async function getStaffMember(req, res) {
  const { hospitalId, staffMemberId } = matchedData(req);

  const staffMember = await prisma.hospitalStaff.findUnique({
    where: {
      id: staffMemberId,
      hospital_id: hospitalId,
    },
    select: {
      name: true,
      email: true,
    },
  });

  if (!staffMember) {
    return notFoundHandler(res);
  }

  return res.status(200).json({ ...staffMember });
}

async function createStaffMember(req, res) {
  const {
    name,
    email,
    password,
    hospitalId
  } = matchedData(req);

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const staffMember = await prisma.hospitalStaff.create({
      data: {
        name: name,
        email: email,
        password_hash: passwordHash,
        hospital_id: hospitalId,
      },
    });

    return res.status(200).json({ ...staffMember });
  } catch (err) {
    if (err.code === 'P2002') {
      return conflictErrorHandler(res, err.meta.target[0]);
    } else {
      console.error(err);
      return internalErrorHandler(res);
    }
  }
}

async function authenticateStaffMember(req, res) {
  const {
    email,
    password
  } = matchedData(req);

  try {
    const staffMember = await prisma.hospitalStaff.findUnique({
      where: { email },
    });

    if (!staffMember) {
      return res.status(404).json({
        error: {
          message: 'Couldn\'t find your account',
          field: 'email',
          code: 404
        }
      });
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      staffMember.password_hash
    );
    if (!isCorrectPassword) {
      return res.status(401).json({
        error: {
          message: 'Wrong password',
          field: 'password',
          code: 401
        }
      });
    }

    const authorizationToken = jwt.sign(
      {
        id: staffMember.id,
        hospitalId: staffMember.hospital_id,
        role: 'staff'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ authorizationToken });
  } catch (err) {
    console.error(err);
    return internalErrorHandler(res);
  }
}

async function updateStaffMember(req, res) {
  const {
    staffMemberId,
    name,
    email,
    password,
    hospitalId
  } = matchedData(req);

  try {
    let passwordHash;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedStaffMember = await prisma.hospitalStaff.update({
      where: {
        id: staffMemberId,
        hospital_id: hospitalId,
      },
      data: {
        name: name,
        email: email,
        password_hash: passwordHash,
      },
    });

    return res.status(200).json({ ...updatedStaffMember });
  } catch (err) {
    if (err.code === 'P2002') {
      return conflictErrorHandler(res, err.meta.target[0]);
    } else if (err.code === 'P2025') {
      return notFoundHandler(res);
    } else {
      console.error(err);
      return internalErrorHandler(res);
    }
  }
}

async function deleteStaffMember(req, res) {
  const { hospitalId, staffMemberId } = matchedData(req);

  try {
    const deletedStaffMember = await prisma.hospitalStaff.delete({
      where: {
        id: staffMemberId,
        hospital_id: hospitalId,
      },
    });

    return res.status(200).json({ ...deletedStaffMember });
  } catch (err) {
    if (err.code === 'P2025') {
      return notFoundHandler(res);
    } else {
      console.error(err);
      return internalErrorHandler(res);
    }
  }
}

async function checkStaffMemberEmail(req, res, next) {
  const { hospitalId, email } = matchedData(req);

  const existing = await prisma.hospitalStaff.findFirst({
    where: {
      AND: [
        { hospital_id: hospitalId },
        { email: email },
      ],
    },
  });

  if (email && existing) {
    return conflictErrorHandler(res, 'email');
  }

  next();
}


export {
  getStaff,
  getHospitalStaff,
  getStaffMember,
  checkStaffMemberEmail,
  createStaffMember,
  authenticateStaffMember,
  updateStaffMember,
  deleteStaffMember,
}
