import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async log(
    user: User,
    action: string,
    details: Record<string, any>,
  ): Promise<void> {
    const log = this.auditRepository.create({
      user,
      action,
      details,
    });
    await this.auditRepository.save(log);
  }
}
