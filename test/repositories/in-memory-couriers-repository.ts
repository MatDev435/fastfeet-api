import { CouriersRepository } from '@/domain/users/application/repositories/couriers-repository'
import { Courier } from '@/domain/users/enterprise/entities/courier'

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = []

  async findByCpf(cpf: string): Promise<Courier> {
    const courier = this.items.find((item) => item.cpf === cpf)

    if (!courier) {
      return null
    }

    return courier
  }

  async create(courier: Courier): Promise<void> {
    this.items.push(courier)
  }
}
