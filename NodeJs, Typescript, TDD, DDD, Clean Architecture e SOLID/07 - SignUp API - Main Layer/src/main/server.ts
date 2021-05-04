import { MongoHelper } from '../infra/db/mongodb/helpers/helper-mongo'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
.then(async () => {
    const app = (await import app from './config/app').default
    app.listen(env.port, () => console.log('Server running! http://localhost:5050/'))
  })
  .catch(console.error)
