import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(BigInt.prototype as any).toJSON = function () { return this.toString(); };
async function main() {
  const users = await prisma.users.findMany();
  console.log(JSON.stringify(users, null, 2));
}
main();
