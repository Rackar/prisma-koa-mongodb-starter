import Koa from 'koa'
import  http from "http"
import { useMiddlewares } from './koa.middlewares'

const createServer = async (): Promise<Koa> => {
  const koa: Koa = new Koa()

  useMiddlewares(koa)


  const app: Koa = koa;
  var server= http.createServer(app.callback());
  
  server.listen(3002);

  return app
}

export default createServer
