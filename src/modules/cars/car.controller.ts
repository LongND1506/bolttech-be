import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CarService } from './car.service';
import {
  CarDto,
  CarsQueryDto,
  CreateCarDto,
  CreateCarResponseDto,
} from './dto';

@ApiTags('cars')
@Controller('cars')
export class CarController {
  constructor(private readonly _carService: CarService) {}

  @ApiOperation({ summary: 'Get available cars' })
  @ApiResponse({ type: CarDto, isArray: true, status: 200 })
  @Get()
  async getCars(@Query() payload: CarsQueryDto): Promise<CarDto[]> {
    return this._carService.getCars(payload);
  }

  @ApiOperation({ summary: 'Create a new car' })
  @ApiResponse({ type: CarDto, isArray: true, status: 200 })
  @Post()
  async createCar(
    @Body() payload: CreateCarDto,
  ): Promise<CreateCarResponseDto> {
    return await this._carService.createCar(payload);
  }
}
