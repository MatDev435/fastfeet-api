import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeAdmin } from 'test/factories/make-admin'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { DeleteRecipientUseCase } from './delete-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository

let sut: DeleteRecipientUseCase

describe('Delete Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new DeleteRecipientUseCase(
      inMemoryRecipientsRepository,
      inMemoryAdminsRepository,
    )
  })

  it('should be able to delete an recipient', async () => {
    await inMemoryAdminsRepository.create(
      makeAdmin({}, new UniqueEntityID('admin-01')),
    )

    await inMemoryRecipientsRepository.create(
      makeRecipient({}, new UniqueEntityID('recipient-01')),
    )

    const result = await sut.execute({
      recipientId: 'recipient-01',
      adminId: 'admin-01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items).toHaveLength(0)
  })
})
