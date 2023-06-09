import { Injectable } from '@nestjs/common';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create({
    make,
    model,
    year,
    mileage,
    lng,
    lat,
    price,
  }: CreateReportDto) {
    const reportCreated = this.repo.create({
      make,
      model,
      year,
      mileage,
      lng,
      lat,
      price,
    });

    await this.repo.save(reportCreated);

    return reportCreated;
  }
}
