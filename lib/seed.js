const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')
// const { oura } = require('./data/oura.csv')
// const { micro } = require('./data/micro.csv')
// const { macro } = require('./data/macro.csv')
// const { levels } = require('./data/levels.csv')

const prisma = new PrismaClient()

const load = async () => {
  // const data = []
  // console.log(path.join(__dirname, 'data'))
  // fs.createReadStream(path.join(__dirname, 'data/oura.csv'))
  //   .pipe(parse({ delimiter: ',' }))
  //   .on('data', function (row) {
  //     console.log(row)
  //     return
  //   })
  //   .on('error', function (error) {
  //     console.log(error.message)
  //   })
  //   .on('end', function () {
  //     console.log('finished')
  //   })

  // await prisma.post.deleteMany()
  // console.log('Deleted records in post table')
  await prisma.levels.deleteMany()
  console.log('Deleted records in levels table')

  // await prisma.appleMicro.deleteMany()
  // console.log('Deleted records in appleMicro table')

  // await prisma.appleMacro.deleteMany()
  // console.log('Deleted records in appleMacro table')

  // await prisma.oura.deleteMany()
  // console.log('Deleted records in oura table')

  await prisma.$queryRaw`ALTER TABLE Levels AUTO_INCREMENT = 1`
  console.log('reset Levels auto increment to 1')

  // await prisma.$queryRaw`ALTER TABLE Post AUTO_INCREMENT = 1`
  // console.log('reset Post auto increment to 1')

  // await prisma.$queryRaw`ALTER TABLE AppleMicro AUTO_INCREMENT = 1`
  // console.log('reset AppleMicro auto increment to 1')

  // await prisma.$queryRaw`ALTER TABLE AppleMacro AUTO_INCREMENT = 1`
  // console.log('reset AppleMacro auto increment to 1')

  // await prisma.$queryRaw`ALTER TABLE Oura AUTO_INCREMENT = 1`
  // console.log('reset oura auto increment to 1')
  try {
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

load()
