import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { RegisterCourierUseCase } from './register-courier'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let fakeHasher: FakeHasher
let sut: RegisterCourierUseCase

describe('Register Courier', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterCourierUseCase(inMemoryCouriersRepository, fakeHasher)
  })

  it('should be able to create an courier', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123.456.789-00',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      courier: inMemoryCouriersRepository.items[0],
    })
  })

  it('should hash password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123.456.789-00',
      password: '123456',
    })

    const hashedPassed = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(hashedPassed).toEqual(inMemoryCouriersRepository.items[0].password)
  })
})
