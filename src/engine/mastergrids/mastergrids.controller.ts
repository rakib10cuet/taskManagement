import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MastergridsService } from './mastergrids.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('mastergrids')
@ApiTags('mastergrids')
@ApiBearerAuth('jwt')
export class MastergridsController {
  constructor(private mastergridsService: MastergridsService) {}

  @ApiOperation({
    summary: 'Get Master grid Data By grid Slug',
    description:
      'This masterGrid api is responsible for retrieveing master grid data by get request.',
  })
  @UseGuards(AuthGuard)
  @Get(':slug')
  async masterGrid(@Param('slug') slug: string) {
    const dropdownData = await this.mastergridsService.masterGrid(slug);
    return { message: 'Successfully Retrieved Data!!!', data: dropdownData };
  }
}
