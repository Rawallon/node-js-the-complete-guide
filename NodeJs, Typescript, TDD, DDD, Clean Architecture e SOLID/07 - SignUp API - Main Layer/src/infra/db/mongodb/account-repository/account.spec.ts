import { MongoHelper } from '../helpers/helper-mongo'
import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
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

  test('Should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'name',
      email: 'email',
      password: 'password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('name')
    expect(account.email).toBe('email')
    expect(account.password).toBe('password')
  })
})
