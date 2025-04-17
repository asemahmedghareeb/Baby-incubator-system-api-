import { WebSocket } from 'ws';
import { PrismaClient } from '@prisma/client';
import { matchedData } from 'express-validator';
import {
  notFoundHandler,
  internalErrorHandler,
  conflictErrorHandler
} from '../middlewares/errorHandlers.js';
import { connectedParents } from '../index.js';


const prisma = new PrismaClient();

async function getHospitalReservations(req, res) {
  const { hospitalId } = matchedData(req);

  const hospitalReservations = await prisma.reservation.findMany({
    where: {
      hospital_id: hospitalId,
    },
  });

  return res.status(200).json({ hospitalReservations });
}

async function updateReservation(req, res) {
  const {
    hospitalId,
    reservationId,
    status
  } = matchedData(req);

  try {
    const reservation = await prisma.reservation.update({
      where: {
        id: reservationId,
        hospital_id: hospitalId,
      },
      data: {
        status,
      },
    });

    connectedParents.forEach(client => {
      console.log(client.role);
      console.log(client.id);
      if (client.readyState === WebSocket.OPEN
        && client.id === reservation.user_id) {
        client.send(
          JSON.stringify({
            type: 'updateReservation',
            status: reservation.status
          })
        );
      }
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
  getHospitalReservations,
  updateReservation
}
