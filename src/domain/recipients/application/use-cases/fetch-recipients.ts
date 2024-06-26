import { Either, left, right } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed'
import { AdminsRepository } from '@/domain/users/application/repositories/admins-repository'
import { Recipient } from '../../enterprise/entities/recipient'

interface FetchRecipientsUseCaseRequest {
  adminId: string
  page: number
}

type FetchRecipientsUseCaseResponse = Either<
  NotAllowedError,
  { recipients: Recipient[] }
>

export class FetchRecipientsUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    page,
  }: FetchRecipientsUseCaseRequest): Promise<FetchRecipientsUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const recipients = await this.recipientsRepository.findMany({ page })

    return right({ recipients })
  }
}
