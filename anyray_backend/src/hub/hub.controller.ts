// hub.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { HubService } from './hub.service';
import { CreateHubDto } from './dto/create-hub.dto';
import { Hub } from './entities/hub.entity';

@Controller('hub')
export class HubController {
  constructor(private readonly hubService: HubService) {}

  @Post()
  async create(@Body() createHubDto: CreateHubDto): Promise<Hub> {
    return this.hubService.create(createHubDto);
  }
}
