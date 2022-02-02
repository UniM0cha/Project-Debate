import { Logger } from '@nestjs/common';
import { EntityRepository, MoreThan, Repository } from 'typeorm';
import { ReserveType, TopicReserve } from '../entity/topic-reservation.entity';

@EntityRepository(TopicReserve)
export class TopicReserveRepository extends Repository<TopicReserve> {
  private readonly logger = new Logger(TopicReserveRepository.name);

  async findTodayTopicReserve(): Promise<TopicReserve> {
    const today = new Date();
    today.setHours(9, 0, 0, 0);
    this.logger.debug(`Find Today Reserve - Today is: ${today}`);

    return await this.findOne({
      startDate: today,
      reserveState: ReserveType.PENDING,
    });
  }

  async findNextReserve(): Promise<TopicReserve> {
    const today = new Date();
    today.setHours(9, 0, 0, 0);

    return await this.findOne({
      where: { startDate: MoreThan(today) },
      relations: ['topic'],
      order: { startDate: 'ASC' },
    });
  }

  async findCurrentReserve(): Promise<TopicReserve> {
    return await this.findOne(
      {
        reserveState: ReserveType.PROCEEDING,
      },
      { relations: ['topic'] },
    );
  }

  async updateToProceeding(reserveId: number) {
    this.update(
      { reserveId: reserveId },
      { reserveState: ReserveType.PROCEEDING },
    );
  }

  async updateToPassed(reserveId: number) {
    await this.update(
      { reserveId: reserveId },
      { reserveState: ReserveType.PASSED },
    );
  }
}
