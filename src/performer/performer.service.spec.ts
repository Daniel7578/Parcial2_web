import { Test, TestingModule } from '@nestjs/testing';
import { PerformerService } from './performer.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('PerformerService', () => {
  let service: PerformerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
