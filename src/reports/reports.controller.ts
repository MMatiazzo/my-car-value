import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { AproveReportDto } from './dtos/aprove-report.dto';
import { AdminGuard } from '../guards/admin.guard';
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
}
