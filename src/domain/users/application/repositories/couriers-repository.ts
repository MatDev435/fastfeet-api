import { PaginationParams } from '@/core/repositories/pagination-params'
import { Courier } from '../../enterprise/entities/courier'

export abstract class CouriersRepository {
  abstract findByCpf(cpf: string): Promise<Courier | null>
  abstract findMany(params: PaginationParams): Promise<Courier[]>
  abstract create(courier: Courier): Promise<void>
}
