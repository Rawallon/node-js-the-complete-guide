import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/helper-mongo'
import app from '../config/app'

describe('Signup Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accCollection = MongoHelper.getCollection('accounts')
    await accCollection.deleteMany({})
  })
  
  test('Should return account on success ', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Wallon',
        email: 'rawallon@gmail.com',
        password: '123123',
        passwordConfirmation: '123123'
      })
      .expect(200)
  })
})
