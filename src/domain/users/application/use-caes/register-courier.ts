import { Either, left, right } from '@/core/either'
import { CourierAlreadyExistsError } from './errors/courier-already-exists'
import { Courier } from '../../enterprise/entities/courier'
import { HashGenerator } from '../cryptography/hash-generator'
import { CouriersRepository } from '../repositories/couriers-repository'

interface RegisterCourierUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type RegisterCourierUseCaseResponse = Either<
  CourierAlreadyExistsError,
  { courier: Courier }
>

export class RegisterCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterCourierUseCaseRequest): Promise<RegisterCourierUseCaseResponse> {
    const courierWithSameCpf = await this.couriersRepository.findByCpf(cpf)

    if (courierWithSameCpf) {
      return left(new CourierAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const courier = Courier.create({
      name,
      cpf,
      password: hashedPassword,
    })

    await this.couriersRepository.create(courier)

    return right({ courier })
  }
}
