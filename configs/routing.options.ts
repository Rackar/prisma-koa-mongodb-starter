import { RoutingControllersOptions } from 'routing-controllers'
import * as controllers from '../src/controllers'
import * as middlewares from './routing.middlewares'
import * as interceptors from './interceptors'
import { dictToArray } from './utils'

export const routingConfigs: RoutingControllersOptions = {
  controllers: dictToArray(controllers),

  middlewares: dictToArray(middlewares), //路由中间件

  interceptors: dictToArray(interceptors),

  // router prefix
  // e.g. api => http://hostname:port/{routePrefix}/{controller.method}
  routePrefix: '/api',

  // auto validate entity item
  // learn more: https://github.com/typestack/class-validator
  validation: true,
}