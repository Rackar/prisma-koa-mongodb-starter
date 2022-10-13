import { KoaMiddlewareInterface, Middleware } from 'routing-controllers'
import { Service } from 'typedi'

@Middleware({ type: 'before' })
@Service()
export class HeaderMiddleware implements KoaMiddlewareInterface {
  async use(context: any, next: (err?: any) => any): Promise<any> {
    // context.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH')
    // context.set(
    //   'Access-Control-Allow-Origin',
    //   context.request.header.origin || context.request.origin,
    // )
    // context.set('Access-Control-Allow-Headers', ['content-type'])
    //修改为允许跨域
    context.set("Access-Control-Allow-Origin", "*");
    context.set(
      "Access-Control-Allow-Methods",
      "POST, GET, OPTIONS, PATCH, HEAD, PUT, DELETE"
    );
    context.set('Access-Control-Allow-Headers', ['content-type', 'x-requested-with', 'Authorization', 'Accept'])
    context.set('Access-Control-Allow-Credentials', 'true')
    context.set('Content-Type', 'application/json; charset=utf-8')
    return next()
  }
}
