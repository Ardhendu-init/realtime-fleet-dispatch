import { PrismaClient, UserRole, TripStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      role: UserRole.ADMIN,
    },
  });

  // Create Dispatcher
  const dispatcher = await prisma.user.create({
    data: {
      email: "dispatcher@example.com",
      name: "Main Dispatcher",
      role: UserRole.DISPATCHER,
    },
  });

  // Create Driver
  const driver = await prisma.user.create({
    data: {
      email: "driver@example.com",
      name: "Driver One",
      phone: "9999999999",
      role: UserRole.DRIVER,
    },
  });

  // Create Vehicle for Driver
  const vehicle = await prisma.vehicle.create({
    data: {
      name: "Truck 101",
      vin: "VIN1234567XYZ",
      driverId: driver.id,
    },
  });

  // Create Sample Trip
  await prisma.trip.create({
    data: {
      pickupLat: 22.5726,
      pickupLng: 88.3639,
      dropLat: 22.58,
      dropLng: 88.42,
      assignedToId: driver.id,
      vehicleId: vehicle.id,
      status: TripStatus.PENDING,
    },
  });

  console.log("🌱 Seed complete!");
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
