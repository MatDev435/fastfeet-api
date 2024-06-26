import { Either, right } from '@/core/either'
import { Courier } from '../../enterprise/entities/courier'
import { CouriersRepository } from '../repositories/couriers-repository'

interface FetchCourierUseCaseRequest {
  page: number
}

type FetchCourierUseCaseResponse = Either<null, { couriers: Courier[] }>

export class FetchCourierUseCase {
  constructor(private couriersRepository: CouriersRepository) {}

  async execute({
    page,
  }: FetchCourierUseCaseRequest): Promise<FetchCourierUseCaseResponse> {
    const couriers = await this.couriersRepository.findMany({ page })

    return right({ couriers })
  }
}
