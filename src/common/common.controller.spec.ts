import { Test, TestingModule } from '@nestjs/testing';
import { CommonController } from './common.controller';
import { ConfigService } from '@nestjs/config';

describe('CommonController', () => {
  let controller: CommonController;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'NETWORK') return 'mainnet';
              return null;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<CommonController>(CommonController);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('checkUp should return "All Systems Up"', () => {
    expect(controller.checkUp()).toBe('All Systems Up');
  });

  it('getConfig should return the correct network and deployment times', () => {
    const config = controller.getConfig();
    
    expect(config.network).toBe('mainnet'); // Since we mocked ConfigService to return 'mainnet'
    expect(config.deployed).toBeInstanceOf(Date); // Deployed should be a Date object
    expect(config.now).toBeInstanceOf(Date); // Now should be a Date object
  });
});