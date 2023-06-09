import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MastergridsService } from './mastergrids.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('mastergrids')
export class MastergridsController {
  constructor(private mastergridsService: MastergridsService) {}

  @Get(':slug')
  @UseGuards(AuthGuard)
  async findOneBySlug(@Param('slug') slug: string) {
    const dropdownData = await this.mastergridsService.findOneBySlug(slug);
    return { message: 'Successfully Retrieved Data!!!', data: dropdownData };
  }
}
