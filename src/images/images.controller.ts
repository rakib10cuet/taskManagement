import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { InsertImageDto } from './dto';

@Controller('images')
@ApiTags('Images')
@ApiBearerAuth('jwt')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @ApiOperation({
    summary: 'Insert Image',
    description:
      'this create api is responsible for inserting a image by post request. to make post request check json format properly',
  })
  @Post()
  @UseGuards(AuthGuard)
  async insertImage(@Body() insertImageDto: InsertImageDto) {
    const data = await this.imagesService.insertImage(insertImageDto);
    return { message: 'Sucessfully Inserted Image!!!', data: data };
  }

  @ApiOperation({
    summary: 'Get One Image Details By Image Id',
    description:
      'this findOne api is responsible for retrieveing a Image details by get request.',
  })
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number) {
    const user = await this.imagesService.findOneById(+id);
    return { message: 'Successfully Retrieved User!!!', data: user };
  }
}
