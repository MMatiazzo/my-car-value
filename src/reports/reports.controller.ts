import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  async createRepor(
    @Body() { make, model, year, mileage, lng, lat, price }: CreateReportDto,
  ) {
    return await this.reportsService.create({
      make,
      model,
      year,
      mileage,
      lng,
      lat,
      price,
    });
  }
}
