import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const email = this.configService.get<string>('ADMIN_EMAIL') ?? 'admin@cleanhouse.ca';
    const password = this.configService.get<string>('ADMIN_PASSWORD') ?? 'Admin@2024!';
    const name = this.configService.get<string>('ADMIN_NAME') ?? 'Admin';

    const existing = await this.usersService.findByEmail(email);
    if (!existing) {
      await this.usersService.createAdmin({ email, password, name });
      this.logger.log(`Admin user created: ${email}`);
    } else {
      this.logger.log(`Admin user already exists: ${email}`);
    }
  }
}
