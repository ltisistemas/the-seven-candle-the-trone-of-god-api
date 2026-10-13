import { UserEntity } from '../infrastructure/persistence/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  createWithInitialProgress(email: string, passwordHash: string): Promise<UserEntity>;
}