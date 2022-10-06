const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const load = async () => {
  try {
    const cadenceMap = {
      weekly: 7,
      monthly: 30,
      quarterly: 120,
      annually: 365,
    }
    console.log(cadenceMap.weekly)
    const cadence = 'weekly'
    let d = new Date()
    d.setDate(d.getDate() - cadenceMap[cadence])
    console.log(d)
    console.log(new Date(d))

    const entries = await prisma.oura.findMany({
      // take,
      // skip,
      where: {
        date: {
          // lte: endDateAsDate,
          // gte: startDate,
          lte: new Date(),
          gte: new Date(d),
        },
        authorId: 'cl8ugicc61257o61ex6k9vmrx',
      },
      select: {
        date: true,
        bedTime: true,
        wakeUpTime: true,
        totalSleep: true,
        lowestRestingHeartRate: true,
        averageRestingHeartRate: true,
        averageHRV: true,
        inactiveTime: true,
        averageMET: true,
      },
    })

    console.log(entries)

    // await prisma.post.deleteMany()
    // console.log('Deleted records in post table')
    // await prisma.levels.deleteMany()
    // console.log('Deleted records in levels table')

    // await prisma.appleMicro.deleteMany()
    // console.log('Deleted records in appleMicro table')

    // await prisma.appleMacro.deleteMany()
    // console.log('Deleted records in appleMacro table')

    // await prisma.oura.deleteMany()
    // console.log('Deleted records in oura table')

    // await prisma.$queryRaw`ALTER TABLE Levels AUTO_INCREMENT = 1`
    // console.log('reset Levels auto increment to 1')

    // await prisma.$queryRaw`ALTER TABLE Post AUTO_INCREMENT = 1`
    // console.log('reset Post auto increment to 1')

    // await prisma.$queryRaw`ALTER TABLE AppleMicro AUTO_INCREMENT = 1`
    // console.log('reset AppleMicro auto increment to 1')

    // await prisma.$queryRaw`ALTER TABLE AppleMacro AUTO_INCREMENT = 1`
    // console.log('reset AppleMacro auto increment to 1')

    // await prisma.$queryRaw`ALTER TABLE Oura AUTO_INCREMENT = 1`
    // console.log('reset oura auto increment to 1')
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

load()
