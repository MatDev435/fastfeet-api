import { PaginationParams } from '@/core/repositories/pagination-params'
import { CouriersRepository } from '@/domain/users/application/repositories/couriers-repository'
import { Courier } from '@/domain/users/enterprise/entities/courier'

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = []

  async findById(courierId: string): Promise<Courier> {
    const courier = this.items.find((item) => item.id.toString() === courierId)

    if (!courier) {
      return null
    }

    return courier
  }

  async findByCpf(cpf: string): Promise<Courier> {
    const courier = this.items.find((item) => item.cpf === cpf)

    if (!courier) {
      return null
    }

    return courier
  }

  async findMany({ page }: PaginationParams): Promise<Courier[]> {
    const couriers = this.items.splice((page - 1) * 20, page * 20)

    return couriers
  }

  async save(courier: Courier): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === courier.id)

    this.items[itemIndex] = courier
  }

  async create(courier: Courier): Promise<void> {
    this.items.push(courier)
  }

  async delete(courier: Courier): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === courier.id)

    this.items.splice(itemIndex, 1)
  }
}
