import { Courier } from '../../enterprise/entities/courier'

export abstract class CouriersRepository {
  abstract findByCpf(cpf: string): Promise<Courier | null>
  abstract create(courier: Courier): Promise<void>
}