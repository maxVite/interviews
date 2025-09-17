import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let testEmployeeId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.setGlobalPrefix('api');

    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    const testEmployee = await prismaService.user.create({
      data: {
        email: 'test@example.com',
        firstName: 'John',
        lastNames: 'Doe',
        phone: '+1234567890',
      },
    });
    testEmployeeId = testEmployee.id;
  });

  afterAll(async () => {
    // TODO: This should be done in a mock database
    if (testEmployeeId) {
      await prismaService.$transaction([
        prismaService.interview.deleteMany({
          where: { userId: testEmployeeId },
        }),
        prismaService.user.delete({
          where: { id: testEmployeeId },
        }),
      ]);
    }
    await app.close();
  });

  describe('GET /api/employees', () => {
    it('should return 400 Bad Request for invalid search parameter (array)', () => {
      return request(app.getHttpServer())
        .get('/api/employees')
        .query({ search: ['invalid', 'array'] })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('search must be a string');
        });
    });

    it('should return 200 OK with employees list for valid search parameter', () => {
      return request(app.getHttpServer())
        .get('/api/employees')
        .query({ search: 'John' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          const employee = res.body[0];
          expect(employee).toEqual({
            id: expect.any(String),
            email: expect.any(String),
            firstName: expect.any(String),
            lastNames: expect.any(String),
            phone: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return 404 Not Found for non-existent employee', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      return request(app.getHttpServer())
        .get(`/api/employees/${nonExistentId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe(
            `Employee with id ${nonExistentId} not found`,
          );
        });
    });

    it('should return 200 OK with employee details for valid employee', () => {
      return request(app.getHttpServer())
        .get(`/api/employees/${testEmployeeId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            id: testEmployeeId,
            email: 'test@example.com',
            firstName: 'John',
            lastNames: 'Doe',
            phone: '+1234567890',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            interviews: expect.any(Array),
          });
        });
    });
  });
});
