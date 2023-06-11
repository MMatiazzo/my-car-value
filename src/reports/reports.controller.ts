import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';

import { ReportDto } from './dtos/report.dto';
import { AproveReportDto } from './dtos/aprove-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { GetEstimateDto } from './dtos/get-estimate.dto';

import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

import { CurrentUser } from '../users/decorators/current-user.decorator';

import { User } from '../users/user.entity';

import { Serialize } from '../interceptors/serialize.interceptor';
@Serialize(ReportDto)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  async createRepor(
    @Body() { make, model, year, mileage, lng, lat, price }: CreateReportDto,
    @CurrentUser() user: User,
  ) {
    return await this.reportsService.create(
      {
        make,
        model,
        year,
        mileage,
        lng,
        lat,
        price,
      },
      user,
    );
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async approveReport(
    @Param('id') id: string,
    @Body() { approved }: AproveReportDto,
  ) {
    return await this.reportsService.changeApproval(id, approved);
  }

  @Get('/')
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }
}
