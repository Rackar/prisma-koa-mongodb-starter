const jwt = require("jsonwebtoken");
import prisma from '../helpers/client'
import config from "./secret";
// const config = {
//   jwtsecret: 'test', //needChangeToNewSecretString
//   expiresIn: '2d'
// }
// 指定JWT中携带的信息类型
interface CurrentUser {
  id: string;
  username: string;
  role: string;
}

interface IdecodeUser extends CurrentUser {
  exp: number;
  iat: number
}

export function createToken(user: CurrentUser): string {
  let token: string = jwt.sign(
    {
      username: user.username, //payload部分可解密获取，不能放敏感信息
      id: user.id,
      role: user.role
    },
    config.jwtsecret,
    {
      expiresIn: config.expiresIn // 授权时效2天 2d 2h。数字默认为毫秒,ms库
    }
  );
  return token
}

export function verifyToken(token: string): Promise<IdecodeUser> | Promise<null> {
  let secret = config.jwtsecret
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, function (err, decoded: IdecodeUser) {
      if (err) {
        return reject();
      } else {
        if (decoded) {
          return resolve(decoded);
        } else {
          return reject();
        }
      }
    });
  });
}

export async function getUserFromToken(token: string) {
  let decode = await verifyToken(token)
  if (decode) {
    return prisma.user.findUnique({
      where: {
        id: decode.id
      }
    })
  }
}


