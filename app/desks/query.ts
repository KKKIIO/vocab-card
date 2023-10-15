import prisma from "lib/prisma";

export async function requireDefaultDesk(userId: string) {
  const desk = await prisma.desk.findFirst({
    where: { userId },
    orderBy: { id: "asc" },
  });
  if (!desk) {
    throw new Error("Missing default desk");
  }
  return desk;
}
