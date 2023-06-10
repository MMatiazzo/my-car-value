import { Injectable } from '@nestjs/common';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(
    { make, model, year, mileage, lng, lat, price }: CreateReportDto,
    user: User,
  ) {
    const reportCreated = this.repo.create({
      make,
      model,
      year,
      mileage,
      lng,
      lat,
      price,
    });

    reportCreated.user = user;

    await this.repo.save(reportCreated);

    return reportCreated;
  }
}
