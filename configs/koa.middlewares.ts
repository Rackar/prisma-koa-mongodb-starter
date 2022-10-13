import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import { isProd } from './constants'
const json = require("koa-json");

export const useMiddlewares = <T extends Koa>(app: T): T => {
  if (isProd()) {
    app.use(logger())
  }

  app.use(bodyParser({
    enableTypes: ["json", "form", "text"],
  }))
  app.use(json());
  // app.use(require("koa-static")(__dirname + "/uploads"));

  return app
}
