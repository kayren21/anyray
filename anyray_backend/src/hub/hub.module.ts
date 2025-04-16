import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HubService } from './hub.service';
import { HubController } from './hub.controller';
import { Hub } from './entities/hub.entity';
import { Language } from 'src/languages/entities/language.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hub, Language, User]), // Include entities here
  ],
  controllers: [HubController],
  providers: [HubService],
  exports: [HubService],
})
export class HubModule {}
