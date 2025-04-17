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

async function getHospitals(req, res) {
  const hospitals = await prisma.hospital.findMany({
    include: {
      hospitalStaff: true,
      incubators: true,
      reservations: true,
    },
  });

  res.status(200).json({ hospitals });
}

async function getHospital(req, res) {
  const { hospitalId } = matchedData(req);

  const hospital = await prisma.hospital.findUnique({
    where: { id: hospitalId },
    select: {
      name: true,
      email: true,
      type: true,
      phone_number: true,
      city: true,
      address: true,
      longitude: true,
      latitude: true,
      accuracy: true,
    },
  });

  if (!hospital) {
    return notFoundHandler(res);
  }

  return res.status(200).json({ ...hospital });
}

async function createHospital(req, res) {
  const {
    name,
    email,
    password,
    type,
    phoneNumber,
    city,
    address,
    longitude,
    latitude,
    accuracy
  } = matchedData(req);

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const hospital = await prisma.hospital.create({
      data: {
        name: name,
        email: email,
        password_hash: passwordHash,
        type: type,
        phone_number: phoneNumber,
        city: city,
        address: address,
        longitude: longitude,
        latitude: latitude,
        accuracy: accuracy,
      },
    });

    const authorizationToken = jwt.sign(
      { id: hospital.id, role: 'hospital' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ authorizationToken });
  } catch (err) {
    if (err.code === 'P2002') {
      return conflictErrorHandler(res, err.meta.target[0]);
    } else {
      console.error(err);
      return internalErrorHandler(res);
    }
  }
}

async function authenticateHospital(req, res) {
  const { email, password } = matchedData(req);

  try {
    const hospital = await prisma.hospital.findUnique({
      where: { email },
    });
    if (!hospital) {
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
      hospital.password_hash
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
      { id: hospital.id, role: 'hospital' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ authorizationToken });
  } catch (err) {
    console.error(err);
    return internalErrorHandler(res);
  }
}

async function updateHospital(req, res) {
  const {
    hospitalId,
    name,
    email,
    password,
    type,
    phoneNumber,
    city,
    address,
    longitude,
    latitude,
    accuracy
  } = matchedData(req);

  try {
    let passwordHash;
    if (password) {
      passwordHash = await bcrypt.hash(newData.password, 10);
    }

    const updatedHospital = await prisma.hospital.update({
      where: { id: hospitalId },
      data: {
        name: name,
        email: email,
        password_hash: passwordHash,
        type: type,
        phone_number: phoneNumber,
        city: city,
        address: address,
        longitude: longitude,
        latitude: latitude,
        accuracy: accuracy,
      },
    });

    return res.status(200).json({ ...updatedHospital });
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

async function deleteHospital(req, res) {
  const { hospitalId } = matchedData(req);

  try {
    const deletedHospital = await prisma.hospital.delete({
      where: { id: hospitalId },
    });

    return res.status(200).json({ ...deletedHospital });
  } catch (err) {
    if (err.code === 'P2025') {
      return notFoundHandler(res);
    } else {
      console.error(err);
      return internalErrorHandler(res);
    }
  }
}

export {
  getHospitals,
  getHospital,
  createHospital,
  authenticateHospital,
  updateHospital,
  deleteHospital,
}
