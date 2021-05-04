import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hashedValue')
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('BCrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('anyValue')
    expect(hashSpy).toHaveBeenCalledWith('anyValue', salt)
  })

  test('Should return hashed value on success', async () => {
    const sut = makeSut()
    const hashedReturn = await sut.encrypt('anyValue')
    expect(hashedReturn).toBe('hashedValue')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.encrypt('anyValue')
    await expect(promise).rejects.toThrow()
  })
})
