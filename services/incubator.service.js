import { PrismaClient } from '@prisma/client';
import { matchedData } from 'express-validator';
import {
  notFoundHandler,
  internalErrorHandler,
  conflictErrorHandler
} from '../middlewares/errorHandlers.js';


const prisma = new PrismaClient();

async function getIncubators(req, res) {
  const incubators = await prisma.incubator.findMany();

  return res.status(200).json({ incubators });
}

async function getHospitalIncubators(req, res) {
  const { hospitalId } = matchedData(req);

  const hospitalIncubators = await prisma.incubator.findMany({
    where: { hospital_id: hospitalId },
    select: {
      id: true,
      name: true,
      type: true,
      status: true,
      rent_per_day: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return res.status(200).json({ hospitalIncubators });
}

async function getIncubator(req, res) {
  const { hospitalId, incubatorId } = matchedData(req);

  const incubator = await prisma.incubator.findUnique({
    where: {
      id: incubatorId,
      hospital_id: hospitalId,
    },
    select: {
      id: true,
      name: true,
      type: true,
      status: true,
      rent_per_day: true,
    }
  });

  if (incubator === null) {
    return notFoundHandler(res);
  }

  return res.status(200).json({ ...incubator });
}

async function createIncubator(req, res) {
  const {
    name,
    type,
    status,
    rentPerDay,
    hospitalId
  } = matchedData(req);

  try {
    const newIncubator = await prisma.incubator.create({
      data: {
        name: name,
        type: type,
        status: status,
        rent_per_day: rentPerDay,
        hospital_id: hospitalId,
      },
    });

    return res.status(200).json({ ...newIncubator });
  } catch (err) {
    console.error(err);
    return internalErrorHandler(res);
  }
}


async function updateIncubator(req, res) {
  const {
    incubatorId,
    name,
    type,
    status,
    rentPerDay,
    hospitalId
  } = matchedData(req);

  try {
    const updatedIncubator = await prisma.incubator.update({
      where: {
        id: incubatorId,
        hospital_id: hospitalId
      },
      data: {
        name: name,
        type: type,
        status: status,
        rent_per_day: rentPerDay,
      },
    });

    return res.status(200).json({ ...updatedIncubator });
  } catch(err) {
    if (err.code === 'P2025') {
      return notFoundHandler(res);
    } else {
      console.error(err);
      return internalErrorHandler(res);
    }
  }
}


async function deleteIncubator(req, res) {
  const { hospitalId, incubatorId } = matchedData(req);
  try {
    const deletedIncubator = await prisma.incubator.delete({
      where: {
        id: incubatorId,
        hospital_id: hospitalId,
      },
    });

    return res.status(200).json({ ...deletedIncubator });
  } catch(err) {
    if (err.code === 'P2025') {
      return notFoundHandler(res);
    } else {
      console.error(err);
      return internalErrorHandler(res);
    }
  }
}

async function checkIncubatorName(req, res, next) {
  const { hospitalId, name } = matchedData(req);

  const existing = await prisma.incubator.findFirst({
    where: {
      AND: [
        { hospital_id: hospitalId },
        { name: name },
      ],
    },
  });

  if (name && existing) {
    return conflictErrorHandler(res);
  }

  next();
}


export {
  getIncubators,
  getHospitalIncubators,
  getIncubator,
  createIncubator,
  updateIncubator,
  deleteIncubator,
  checkIncubatorName,
}
