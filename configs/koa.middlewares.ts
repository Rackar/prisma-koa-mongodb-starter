import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import { isProd } from './constants'
const json = require("koa-json");
const mount = require('koa-mount');
import path from "path";
// const jwt = require("koa-jwt");

export const useMiddlewares = <T extends Koa>(app: T): T => {
  if (isProd()) {
    app.use(logger())
  }

  app.use(bodyParser({
    enableTypes: ["json", "form", "text"],
  }))
  app.use(json());

  app.use(mount('/uploads', require("koa-static")(path.resolve(__dirname, "../uploads"))));
  // app.use(
  //   jwt({ secret: 'aa' }).unless({
  //     path: [/^\/noauth/, /^\/api/]
  //   })
  // );

  return app
}
