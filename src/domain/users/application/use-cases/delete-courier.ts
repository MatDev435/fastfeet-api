import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/couriers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { AdminsRepository } from '../repositories/admins-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed'

interface DeleteCourierUseCaseRequest {
  courierId: string
  adminId: string
}

type DeleteCourierUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>

export class DeleteCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    courierId,
    adminId,
  }: DeleteCourierUseCaseRequest): Promise<DeleteCourierUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    await this.couriersRepository.delete(courier)

    return right({})
  }
}
