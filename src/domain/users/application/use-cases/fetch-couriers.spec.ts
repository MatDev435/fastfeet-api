import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { FetchCourierUseCase } from './fetch-couriers'
import { makeCourier } from 'test/factories/make-courier'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: FetchCourierUseCase

describe('Fetch Couriers', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new FetchCourierUseCase(inMemoryCouriersRepository)
  })

  it('should be able to list couriers', async () => {
    await inMemoryCouriersRepository.create(makeCourier())
    await inMemoryCouriersRepository.create(makeCourier())
    await inMemoryCouriersRepository.create(makeCourier())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value.couriers).toHaveLength(3)
  })

  it('should list paginated couriers', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCouriersRepository.create(makeCourier())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value.couriers).toHaveLength(2)
  })
})
