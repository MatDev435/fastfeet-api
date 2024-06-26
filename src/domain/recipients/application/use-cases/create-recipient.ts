import { Either, left, right } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed'
import { AdminsRepository } from '@/domain/users/application/repositories/admins-repository'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists'

interface CreateRecipientUseCaseRequest {
  adminId: string
  name: string
}

type CreateRecipientUseCaseResponse = Either<
  RecipientAlreadyExistsError | NotAllowedError,
  { recipient: Recipient }
>

export class CreateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    name,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientsRepository.findByName(name)

    if (recipient) {
      return left(new RecipientAlreadyExistsError(name))
    }

    await this.recipientsRepository.create(recipient)

    return right({ recipient })
  }
}
