import { Controller, Post, Body, Get, Query, Param, Patch } from '@nestjs/common';
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

  @Get('user/:userId')
  async getAllByUser(@Param('userId') userId: string): Promise<Hub[]> {
    return this.hubService.findAllByUserId(userId);
  }


  @Get('default')
  async getDefaultHub(@Query('userId') userId: string) {
    const trimmedId = userId.trim(); 

    return this.hubService.findDefaultByUser(trimmedId);
  }

  @Patch(':id/make-default')
  async makeDefault(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.hubService.setDefaultHub(id);
    return { success: true };
  }

  @Patch(':id/update-level')
  async updateLevel(
    @Param('id') id: string,
    @Body('level') level: string,
  ): Promise<Hub> {
    return this.hubService.updateLevel(id, level);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.hubService.findByIdWithRelations(id);
  }




}
