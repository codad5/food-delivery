import App from "./index"
import UserRouter from './routes/user'

const app = new App
app.useRoute('/user',UserRouter)
.closeMongoose()
.closeRedis()

app.start(5000)