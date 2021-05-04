import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  test('Should enable CORS ', async () => {
    app.post('/cors', (req, res) => { res.send() })
    await request(app)
      .post('/cors')
      .expect('access-controll-allow-origin', '*')
      .expect('access-controll-allow-methods', '*')
      .expect('access-controll-allow-headers', '*')
  })
})
