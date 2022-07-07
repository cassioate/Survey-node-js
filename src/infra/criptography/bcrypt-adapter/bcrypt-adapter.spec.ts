import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hashed_password'
  },

  async compare (): Promise<boolean> {
    return true
  }
}))

interface SutTypes {
  sut: BcryptAdapter
}

const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter()
  return {
    sut
  }
}

describe('Bcrypt Adapter', () => {
  test('Should call the bcrypt hash with the corrects values', async () => {
    const { sut } = makeSut()
    const spyOnBcrypt = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('password')
    expect(spyOnBcrypt).toBeCalledWith('password', 12)
  })

  test('Should return the value encrypted', async () => {
    const { sut } = makeSut()
    const result = await sut.encrypt('password')
    expect(result).toEqual('hashed_password')
  })

  test('Should throw if bcrypt hash throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error('bcrypt hash throw')
    })
    const result = sut.encrypt('password')
    await expect(result).rejects.toThrow('bcrypt hash throw')
  })

  test('Should call the bcrypt compare with the corrects values', async () => {
    const { sut } = makeSut()
    const spyOnBcrypt = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_password', 'hashed_password')
    expect(spyOnBcrypt).toBeCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if bcrypt compare throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      throw new Error('bcrypt compare throw')
    })
    const result = sut.compare('any_password', 'hashed_password')
    await expect(result).rejects.toThrow('bcrypt compare throw')
  })

  test('Should return the value true if all goins ok', async () => {
    const { sut } = makeSut()
    const result = await sut.compare('any_password', 'hashed_password')
    expect(result).toBe(true)
  })
})
