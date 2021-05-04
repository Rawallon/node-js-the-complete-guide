import request from 'supertest'
import app from '../config/app'

describe('Content-type Middleware', () => {
  test('Should return default content-type as json ', async () => {
    app.get('/content-type', (req, res) => { res.send('') })
    await request(app)
      .get('/content-type')
      .expect('content-type', /json/)
  })

  test('Should return xml as content-type', async () => {
    app.get('/content-type-xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app)
      .get('/content-type-xml')
      .expect('content-type', /xml/)
  })
})
