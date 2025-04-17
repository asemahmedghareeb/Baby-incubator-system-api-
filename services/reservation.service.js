import { WebSocket } from 'ws';
import { PrismaClient } from '@prisma/client';
import { matchedData } from 'express-validator';
import {
  notFoundHandler,
  internalErrorHandler,
  conflictErrorHandler
} from '../middlewares/errorHandlers.js';
import { connectedStaff } from '../index.js';


const prisma = new PrismaClient();

/* Temporary */
async function getReservations(req, res) {
  const reservations = await prisma.reservation.findMany();

  return res.status(200).json({ reservations });
}

async function deleteReservations(req, res) {
  const reservations = await prisma.reservation.deleteMany();

  return res.status(200).json({ reservations });
}
/* Temporary */

async function getUserReservations(req, res) {
  const { parentId } = matchedData(req);
  const userReservations = await prisma.reservation.findMany({
    where: {
      parent_id: parentId,
    },
    select: {
      id: true,
      status: true,
      baby_name: true,
      baby_age: true,
      baby_gender: true,
      baby_weight: true,
      birth_hospital: true,
      birth_doctor_name: true,
      birth_doctor_phone: true,
      created_at: true,
      updated_at: true,
      hospital: {
        select: {
          name: true,
          phone_number: true,
          city: true,
          address: true,
        },
      },
    },
  });

  return res.status(200).json({ userReservations });
}

async function getReservation(req, res) {
  const { parentId, reservationId } = matchedData(req);

  const reservation = await prisma.reservation.findUnique({
    where: {
      id: reservationId,
      parent_id: parentId,
    },
    select: {
      id: true,
      status: true,
      baby_name: true,
      baby_age: true,
      baby_gender: true,
      baby_weight: true,
      birth_hospital: true,
      birth_doctor_name: true,
      birth_doctor_phone: true,
      created_at: true,
      updated_at: true,
      hospital: {
        select: {
          name: true,
          phone_number: true,
          city: true,
          address: true,
        },
      },
    },
  });

  if (reservation === null) {
    return notFoundHandler(res);
  }

  return res.status(200).json({ ...reservation });
}

async function createReservation(req, res) {
  const {
    status,
    babyName,
    babyAge,
    babyGender,
    babyWeight,
    birthHospital,
    birthDoctorName,
    birthDoctorPhone,
    userId,
    incubatorId,
    hospitalId
  } = matchedData(req);

  try {
    const reservation = await prisma.reservation.create({
      data: {
        status,
        baby_name: babyName,
        baby_age: babyAge,
        baby_gender: babyGender,
        baby_weight: babyWeight,
        birth_hospital: birthHospital,
        birth_doctor_name: birthDoctorName,
        birth_doctor_phone: birthDoctorPhone,
        user_id: userId,
        incubator_id: incubatorId,
        hospital_id: hospitalId,
      },
    });

    connectedStaff.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: 'newReservation',
            reservation
          })
        );
      }
    });

    return res.status(200).json({ ...reservation });
  } catch (err) {
    if (err.code === 'P2003') {
      res.status(404).json({
        error: {
          message: 'Hospital Not Found',
          code: 404
        }
      });
    } else {
      console.error(err);
      return internalErrorHandler(res);
    }
  }
}

async function updateReservation(req, res) {
  const {
    reservationId,
    status,
    babyName,
    babyAge,
    babyGender,
    babyWeight,
    birthHospital,
    birthDoctorName,
    birthDoctorPhone,
    parentId,
    incubatorId
  } = matchedData(req);

  try {
    const reservation = await prisma.reservation.update({
      where: {
        id: reservationId,
        parent_id: parentId,
      },
      data: {
        status,
        baby_name: babyName,
        baby_age: babyAge,
        baby_gender: babyGender,
        baby_weight: babyWeight,
        birth_hospital: birthHospital,
        birth_doctor_name: birthDoctorName,
        birth_doctor_phone: birthDoctorPhone,
        parent_id: parentId,
        incubator_id: incubatorId,
      },
      select: {
        id: true,
        status: true,
        baby_name: true,
        baby_age: true,
        baby_gender: true,
        baby_weight: true,
        birth_hospital: true,
        birth_doctor_name: true,
        birth_doctor_phone: true,
        created_at: true,
        updated_at: true,
      },
    });
    
    return res.status(200).json({ ...reservation });
  } catch (err) {
    if (err.code === 'P2025') {
      return notFoundHandler(res);
    } else {
      console.error(err);
      return internalErrorHandler(res);
    }
  }
}

async function deleteReservation(req, res) {
  const { reservationId, parentId } = matchedData(req);

  try {
    const reservation = await prisma.reservation.delete({
      where: {
        id: reservationId,
        parent_id: parentId,
      },
    });

    return res.status(200).json({ ...reservation });
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
  getReservations,
  deleteReservations,
  getUserReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation
}
