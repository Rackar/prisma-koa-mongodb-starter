import { RoutingControllersOptions, Action } from 'routing-controllers'
import * as controllers from '../src/controllers'
import * as middlewares from './routing.middlewares'
import * as interceptors from './interceptors'
import { dictToArray } from './utils'
import { getUserFromToken, verifyToken } from "../src/utils/auth";

export const routingConfigs: RoutingControllersOptions = {
  controllers: dictToArray(controllers),

  middlewares: dictToArray(middlewares), //路由中间件

  interceptors: dictToArray(interceptors),
  authorizationChecker: async (action: Action, roles: string[]) => {
    // 这里可以使用action中的request/response对象
    // 如果装饰器定义了可以访问action角色
    // 也可以使用它们来提供详细的鉴权
    // checker必须返回boolean类型(true or false)或者Promise(回执也必须是boolean)
    // 代码demo：
    const token = action.request.headers['authorization'];

    // const user = await getEntityManager().findOneByToken(User, token);
    // if (user && !roles.length) return true;
    // if (user && roles.find(role => user.roles.indexOf(role) !== -1)) return true;
    let decode = await verifyToken(token)
    if (decode) {
      return true
    }

    return false;
  },
  currentUserChecker: async (action: Action) => {
    // 这里可以使用action中的request/response对象
    // 需要提供一个用来注入控制器方法的用户对象
    // 代码demo：
    const token = action.request.headers['authorization'];
    return getUserFromToken(token);
  },

  // router prefix
  // e.g. api => http://hostname:port/{routePrefix}/{controller.method}
  routePrefix: '/api',

  // auto validate entity item
  // learn more: https://github.com/typestack/class-validator
  validation: true,
}
