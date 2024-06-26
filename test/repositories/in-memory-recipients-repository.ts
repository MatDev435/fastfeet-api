import { PaginationParams } from '@/core/repositories/pagination-params'
import { RecipientsRepository } from '@/domain/recipients/application/repositories/recipients-repository'
import { Recipient } from '@/domain/recipients/enterprise/entities/recipient'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async findById(recipientId: string): Promise<Recipient> {
    const recipient = this.items.find(
      (item) => item.id.toString() === recipientId,
    )

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findByName(name: string): Promise<Recipient> {
    const recipient = this.items.find((item) => item.name === name)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findMany({ page }: PaginationParams): Promise<Recipient[]> {
    const recipients = this.items.splice((page - 1) * 20, page * 20)

    return recipients
  }

  async save(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items[itemIndex] = recipient
  }

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async delete(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items.splice(itemIndex, 1)
  }
}
