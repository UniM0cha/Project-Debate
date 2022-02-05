import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { Chat } from './chat.entity';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {}
