import { AdminsRepository } from '@/domain/users/application/repositories/admins-repository'
import { Admin } from '@/domain/users/enterprise/entities/Admin'
import { Admin, Admin } from '@/domain/users/enterprise/entities/admin'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async findById(adminId: string): Promise<Admin> {
    const admin = this.items.find((item) => item.id.toString() === adminId)

    if (!admin) {
      return null
    }

    return admin
  }

  async findByCpf(cpf: string): Promise<Admin> {
    const admin = this.items.find((item) => item.cpf === cpf)

    if (!admin) {
      return null
    }

    return admin
  }

  async create(admin: Admin): Promise<void> {
    this.items.push(admin)
  }
}
