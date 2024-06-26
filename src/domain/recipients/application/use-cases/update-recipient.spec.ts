import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeAdmin } from 'test/factories/make-admin'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { UpdateRecipientUseCase } from './update-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository

let sut: UpdateRecipientUseCase

describe('Update Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new UpdateRecipientUseCase(
      inMemoryRecipientsRepository,
      inMemoryAdminsRepository,
    )
  })

  it('should be able to update an recipient', async () => {
    await inMemoryAdminsRepository.create(
      makeAdmin({}, new UniqueEntityID('admin-01')),
    )

    await inMemoryRecipientsRepository.create(
      makeRecipient(
        {
          name: 'John Doe',
        },
        new UniqueEntityID('recipient-01'),
      ),
    )

    const result = await sut.execute({
      recipientId: 'recipient-01',
      adminId: 'admin-01',
      newName: 'New name',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items[0].name).toEqual('New name')
  })
})
