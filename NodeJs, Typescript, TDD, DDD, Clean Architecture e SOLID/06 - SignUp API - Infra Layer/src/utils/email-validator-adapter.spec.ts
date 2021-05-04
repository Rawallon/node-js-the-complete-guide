import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))
const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}
describe('Email Validator Adapter', () => {
  test('Should return false if validator returns false ', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid@email.com')
    expect(isValid).toBe(false)
  })
  test('Should return true if validator returns true ', () => {
    const sut = makeSut()
    const isValid = sut.isValid('invalid@email.com')
    expect(isValid).toBe(true)
  })
  test('Should call validator with correct email ', () => {
    const sut = makeSut()
    const emailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any@email.com')
    expect(emailSpy).toHaveBeenCalledWith('any@email.com')
  })
})
