import config from '../src/config/index'
import mongoose from 'mongoose'

const connectMongo = async () => {
  let mongoConnection
  beforeAll(async () => {
    mongoConnection = await mongoose.connect(config.mongoUri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      poolSize: 10
    }, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        process.exit(1)
      }
    })
  })
  
  afterAll(async () => {
    await mongoConnection.close()
    process.exit(1)
  })
}

export default connectMongo
