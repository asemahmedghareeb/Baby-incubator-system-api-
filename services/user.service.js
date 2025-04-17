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

async function getUsers(req, res) {
  const users = await prisma.user.findMany();

  res.status(200).json({ users });
}

async function getUser(req, res) {
  const { userId } = matchedData(req);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      national_id: true,
      phone_number: true,
      city: true,
      address: true,
      longitude: true,
      latitude: true,
      accuracy: true,
    },
  });

  if (!user) {
    return notFoundHandler(res);
  }

  return res.status(200).json({ ...user });
}

async function createUser(req, res) {
  const {
    name,
    email,
    password,
    nationalId,
    phoneNumber,
    city,
    address,
    longitude,
    latitude,
    accuracy
  } = matchedData(req);

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password_hash: passwordHash,
        national_id: nationalId,
        phone_number: phoneNumber,
        city: city,
        address: address,
        longitude: longitude,
        latitude: latitude,
        accuracy: accuracy,
      },
    });

    const authorizationToken = jwt.sign(
      { id: user.id, role: 'parent' },
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

async function authenticateUser(req, res) {
  const { email, password } = matchedData(req);

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
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
      user.password_hash
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
      { id: user.id, role: 'parent' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ authorizationToken });
  } catch (err) {
    console.error(err);
    return internalErrorHandler(res);
  }
}

async function updateUser(req, res) {
  const {
    userId,
    name,
    email,
    password,
    nationalId,
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
      passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name,
        email: email,
        password_hash: passwordHash,
        national_id: nationalId,
        phone_number: phoneNumber,
        city: city,
        address: address,
        longitude: longitude,
        latitude: latitude,
        accuracy: accuracy,
      },
    });

    return res.status(200).json({ ...updatedUser });
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

async function deleteUser(req, res) {
  const { userId } = matchedData(req);

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    return res.status(200).json({ ...deletedUser });
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
  getUsers,
  getUser,
  createUser,
  authenticateUser,
  updateUser,
  deleteUser,
}
