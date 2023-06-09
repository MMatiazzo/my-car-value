import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const staticEmail = 'email2345@email.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: staticEmail, password: 'pass' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(staticEmail);
      });
  });

  afterEach(async () => {
    app.close();
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const staticEmail = 'email2345@email.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: staticEmail, password: 'pass' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(staticEmail);
  });
});
