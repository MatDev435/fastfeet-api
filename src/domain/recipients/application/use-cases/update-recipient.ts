import { Either, left, right } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { NotAllowedError } from '@/core/errors/errors/not-allowed'
import { AdminsRepository } from '@/domain/users/application/repositories/admins-repository'
import { Recipient } from '../../enterprise/entities/recipient'

interface UpdateRecipientUseCaseRequest {
  recipientId: string
  adminId: string
  newName: string
}

type UpdateRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { recipient: Recipient }
>

export class UpdateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    recipientId,
    adminId,
    newName,
  }: UpdateRecipientUseCaseRequest): Promise<UpdateRecipientUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    recipient.name = newName

    await this.recipientsRepository.save(recipient)

    return right({ recipient })
  }
}
