import { Admin } from '../../enterprise/entities/admin'

export abstract class AdminsRepository {
  abstract findById(adminId: string): Promise<Admin | null>
  abstract findByCpf(cpf: string): Promise<Admin | null>
  abstract create(admin: Admin): Promise<void>
}
