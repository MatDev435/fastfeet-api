import { Either, left, right } from '@/core/either'
import { AdminAlreadyExistsError } from './errors/admin-already-exists'
import { Admin } from '../../enterprise/entities/admin'
import { AdminsRepository } from '../repositories/admins-repository'
import { HashGenerator } from '../cryptography/hash-generator'

interface RegisterAdminUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type RegisterAdminUseCaseResponse = Either<
  AdminAlreadyExistsError,
  { admin: Admin }
>

export class RegisterAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const adminWithSameCpf = await this.adminsRepository.findByCpf(cpf)

    if (adminWithSameCpf) {
      return left(new AdminAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const admin = Admin.create({
      name,
      cpf,
      password: hashedPassword,
    })

    await this.adminsRepository.create(admin)

    return right({ admin })
  }
}
