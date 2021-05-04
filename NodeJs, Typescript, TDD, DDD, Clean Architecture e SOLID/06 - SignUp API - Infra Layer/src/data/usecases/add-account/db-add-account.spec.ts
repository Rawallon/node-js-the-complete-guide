import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface SutType {
  sut: DbAddAccount
  encrypterStub: Encrypter
  AddAccountRepositoryStub: AddAccountRepository
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'validId',
        name: 'validName',
        email: 'validEmail',
        password: 'hashedPassword'
      }
      return Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountRepositoryStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('hashedPassword')
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutType => {

  const AddAccountRepositoryStub = makeAddAccountRepository()
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub, AddAccountRepositoryStub)
  return { sut, encrypterStub, AddAccountRepositoryStub }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'validName',
      email: 'validEmail',
      password: 'validPassword'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('validPassword')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = {
      name: 'validName',
      email: 'validEmail',
      password: 'validPassword'
    }
    const promiseAccount = sut.add(accountData)
    await expect(promiseAccount).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, AddAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(AddAccountRepositoryStub, 'add')
    const accountData = {
      name: 'validName',
      email: 'validEmail',
      password: 'validPassword'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: 'hashedPassword'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, AddAccountRepositoryStub } = makeSut()
    jest
      .spyOn(AddAccountRepositoryStub, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = {
      name: 'validName',
      email: 'validEmail',
      password: 'validPassword'
    }
    const promiseAccount = sut.add(accountData)
    await expect(promiseAccount).rejects.toThrow()
  })

  test('Should successfully add account', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'validName',
      email: 'validEmail',
      password: 'validPassword'
    }
    const account = await sut.add(accountData)
    expect(account).toEqual({
      ...accountData,
      id: 'validId',
      password: 'hashedPassword'
    })
  })
})
