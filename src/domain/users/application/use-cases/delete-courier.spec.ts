import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { makeCourier } from 'test/factories/make-courier'
import { makeAdmin } from 'test/factories/make-admin'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteCourierUseCase } from './delete-courier'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: DeleteCourierUseCase

describe('Delete Courier', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new DeleteCourierUseCase(
      inMemoryCouriersRepository,
      inMemoryAdminsRepository,
    )
  })

  it('should be able to delete an courier', async () => {
    await inMemoryAdminsRepository.create(
      makeAdmin({}, new UniqueEntityID('admin-01')),
    )

    await inMemoryCouriersRepository.create(
      makeCourier({}, new UniqueEntityID('courier-01')),
    )

    const result = await sut.execute({
      courierId: 'courier-01',
      adminId: 'admin-01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items).toHaveLength(0)
  })
})
