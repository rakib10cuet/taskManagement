import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DropdownsService } from './dropdowns.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('dropdowns')
@ApiTags('dropdowns')
@ApiBearerAuth('jwt')
export class DropdownsController {
  constructor(private dropdownsService: DropdownsService) {}

  @ApiOperation({
    summary: 'Get Dropdown Data By dropdown Slug',
    description:
      'This findOneBySlug api is responsible for retrieveing Dropdown data by get request.',
  })
  @UseGuards(AuthGuard)
  @Get(':slug')
  async findOneBySlug(@Param('slug') slug: string) {
    const dropdownData = await this.dropdownsService.findOneBySlug(slug);
    return { message: 'Successfully Retrieved Data!!!', data: dropdownData };
  }
}
