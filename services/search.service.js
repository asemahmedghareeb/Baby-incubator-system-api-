import { PrismaClient } from '@prisma/client';
import { matchedData } from 'express-validator';


const prisma = new PrismaClient();

function distance(
  latitude1,
  latitude2,
  longitude1,
  longitude2
) {

  const dLatitude = latitude2 - latitude1;
  const dLongitude = longitude2 - longitude1;

  const a = Math.pow(Math.sin(dLatitude / 2), 2)
              + Math.cos(latitude1)
              * Math.cos(latitude2)
              * Math.pow(Math.sin(dLongitude / 2), 2);

  const c = 2 * Math.asin(Math.sqrt(a));

  // Radius of the earth in kilometers
  const R = 6371;

  return (R * c);
}

async function searchHospital(req, res) {
  let {
    userId,
    longitude,
    latitude,
    city,
    cursor
  } = matchedData(req);

  if (!(longitude && latitude)) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        latitude: true,
        longitude: true,
      },
    });

    longitude = user.longitude;
    latitude = user.latitude;
  }

  const hospitals = await prisma.hospital.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      type: true,
      phone_number: true,
      city: true,
      address: true,
      latitude: true,
      longitude: true,
      incubators: {
        where: {
          status: 'available',
        },
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  hospitals.forEach(hospital => {
    hospital.distance = distance(
      latitude,
      hospital.latitude,
      longitude,
      hospital.longitude
    );
  });

  const filterByAvailability = hospital => {
    return hospital.incubators.length !== 0;
  }
  const filteredHospitals = hospitals.filter(filterByAvailability);

  const compareDistance = (a, b) => {
    return a.distance - b.distance;
  }
  const sortedHospitals = filteredHospitals.sort(compareDistance);

  if (sortedHospitals.length === 0) {
    return res.status(204).json();
  }

  const hospital = sortedHospitals[cursor];

  return res.status(200).json({
    id: hospital.id,
    name: hospital.name,
    type: hospital.type,
    phone_number: hospital.phone_number,
    city: hospital.city,
    address: hospital.address
  });
}


export {
  searchHospital,
}
