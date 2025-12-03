import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  console.log("Reading Users...");
  console.log(await prisma.user.findMany());

  console.log("Reading Vehicles...");
  console.log(await prisma.vehicle.findMany());

  console.log("Reading Trips...");
  console.log(await prisma.trip.findMany());
}

test().finally(() => prisma.$disconnect());
