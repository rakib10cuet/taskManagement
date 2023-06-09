import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DropdownsService } from './dropdowns.service';

@Controller('dropdowns')
export class DropdownsController {
  constructor(private dropdownsService: DropdownsService) {}
  @Get(':slug')
  @UseGuards(AuthGuard)
  async findOneBySlug(@Param('slug') slug: string) {
    const dropdownData = await this.dropdownsService.findOneBySlug(slug);
    return { message: 'Successfully Retrieved Data!!!', data: dropdownData };
  }
}
