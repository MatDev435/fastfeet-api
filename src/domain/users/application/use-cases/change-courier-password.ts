import { Either, left, right } from '@/core/either'
import { Courier } from '../../enterprise/entities/courier'
import { HashGenerator } from '../cryptography/hash-generator'
import { CouriersRepository } from '../repositories/couriers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { AdminsRepository } from '../repositories/admins-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed'

interface ChangeCourierPasswordUseCaseRequest {
  courierId: string
  adminId: string
  newPassword: string
}

type ChangeCourierPasswordUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { courier: Courier }
>

export class ChangeCourierPasswordUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    courierId,
    adminId,
    newPassword,
  }: ChangeCourierPasswordUseCaseRequest): Promise<ChangeCourierPasswordUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    const newHashedPassword = await this.hashGenerator.hash(newPassword)

    courier.password = newHashedPassword

    await this.couriersRepository.save(courier)

    return right({ courier })
  }
}
