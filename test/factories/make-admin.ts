import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/users/enterprise/entities/admin'
import { faker } from '@faker-js/faker'

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      cpf: faker.lorem.sentence(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return admin
}
