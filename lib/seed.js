const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const load = async () => {
  try {
    await prisma.post.deleteMany()
    console.log('Deleted records in post table')
    await prisma.levels.deleteMany()
    console.log('Deleted records in levels table')

    await prisma.appleMicro.deleteMany()
    console.log('Deleted records in appleMicro table')

    await prisma.appleMacro.deleteMany()
    console.log('Deleted records in appleMacro table')

    await prisma.oura.deleteMany()
    console.log('Deleted records in oura table')

    await prisma.$queryRaw`ALTER TABLE Levels AUTO_INCREMENT = 1`
    console.log('reset Levels auto increment to 1')

    await prisma.$queryRaw`ALTER TABLE Post AUTO_INCREMENT = 1`
    console.log('reset Post auto increment to 1')

    await prisma.$queryRaw`ALTER TABLE AppleMicro AUTO_INCREMENT = 1`
    console.log('reset AppleMicro auto increment to 1')

    await prisma.$queryRaw`ALTER TABLE AppleMacro AUTO_INCREMENT = 1`
    console.log('reset AppleMacro auto increment to 1')

    await prisma.$queryRaw`ALTER TABLE Oura AUTO_INCREMENT = 1`
    console.log('reset oura auto increment to 1')
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

load()
