import { Recipient } from '../../enterprise/entities/recipient'

export abstract class RecipientsRepository {
  abstract findById(recipientId: string): Promise<Recipient | null>
  abstract create(recipient: Recipient): Promise<void>
  abstract delete(recipient: Recipient): Promise<void>
}
