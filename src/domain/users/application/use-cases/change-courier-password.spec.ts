import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { ChangeCourierPasswordUseCase } from './change-courier-password'
import { makeCourier } from 'test/factories/make-courier'
import { makeAdmin } from 'test/factories/make-admin'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let sut: ChangeCourierPasswordUseCase

describe('Change Courier Password', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangeCourierPasswordUseCase(
      inMemoryCouriersRepository,
      inMemoryAdminsRepository,
      fakeHasher,
    )
  })

  it('should be able to change courier password', async () => {
    await inMemoryAdminsRepository.create(
      makeAdmin({}, new UniqueEntityID('admin-01')),
    )

    await inMemoryCouriersRepository.create(
      makeCourier({}, new UniqueEntityID('courier-01')),
    )

    const result = await sut.execute({
      courierId: 'courier-01',
      adminId: 'admin-01',
      newPassword: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      courier: inMemoryCouriersRepository.items[0],
    })
  })

  it('should hash password upon password changed', async () => {
    await inMemoryAdminsRepository.create(
      makeAdmin({}, new UniqueEntityID('admin-01')),
    )

    await inMemoryCouriersRepository.create(
      makeCourier({}, new UniqueEntityID('courier-01')),
    )

    const result = await sut.execute({
      courierId: 'courier-01',
      adminId: 'admin-01',
      newPassword: '123456',
    })

    const hashedPassed = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(hashedPassed).toEqual(inMemoryCouriersRepository.items[0].password)
  })
})
