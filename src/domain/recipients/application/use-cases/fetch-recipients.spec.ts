import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { FetchRecipientsUseCase } from './fetch-recipients'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: FetchRecipientsUseCase

describe('Fetch Recipients', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new FetchRecipientsUseCase(
      inMemoryRecipientsRepository,
      inMemoryAdminsRepository,
    )
  })

  it('should be able to list recipients', async () => {
    await inMemoryAdminsRepository.create(
      makeAdmin({}, new UniqueEntityID('admin-01')),
    )

    await inMemoryRecipientsRepository.create(makeRecipient())
    await inMemoryRecipientsRepository.create(makeRecipient())
    await inMemoryRecipientsRepository.create(makeRecipient())

    const result = await sut.execute({
      adminId: 'admin-01',
      page: 1,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    expect(result.value.recipients).toHaveLength(3)
  })

  it('should list paginated recipients', async () => {
    await inMemoryAdminsRepository.create(
      makeAdmin({}, new UniqueEntityID('admin-01')),
    )

    for (let i = 1; i <= 22; i++) {
      await inMemoryRecipientsRepository.create(makeRecipient())
    }

    const result = await sut.execute({
      adminId: 'admin-01',
      page: 2,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    expect(result.value.recipients).toHaveLength(2)
  })
})
