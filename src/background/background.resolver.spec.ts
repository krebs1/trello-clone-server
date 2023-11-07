import { Test, TestingModule } from '@nestjs/testing';
import { BackgroundResolver } from './background.resolver';

describe('BackgroundResolver', () => {
  let resolver: BackgroundResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackgroundResolver],
    }).compile();

    resolver = module.get<BackgroundResolver>(BackgroundResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
