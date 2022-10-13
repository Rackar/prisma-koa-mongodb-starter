export const dictToArray = (dict: object): Array<any> =>
  Object.keys(dict).map(name => dict[name])

const color = {
  'reset': '\x1b[0m', //默认色
  'bright': '\x1B[1m', // 亮色
  'grey': '\x1B[2m', // 灰色
  'italic': '\x1B[3m', // 斜体
  'underline': '\x1B[4m', // 下划线
  'reverse': '\x1B[7m', // 反向
  'hidden': '\x1B[8m', // 隐藏
  'black': '\x1B[30m', // 黑色
  'red': '\x1B[31m', // 红色
  'green': '\x1B[32m', // 绿色
  'yellow': '\x1B[33m', // 黄色
  'blue': '\x1B[34m', // 蓝色
  'magenta': '\x1B[35m', // 品红
  'cyan': '\x1B[36m', // 青色
  'white': '\x1B[37m', // 白色
  'blackBG': '\x1B[40m', // 背景色为黑色
  'redBG': '\x1B[41m', // 背景色为红色
  'greenBG': '\x1B[42m', // 背景色为绿色
  'yellowBG': '\x1B[43m', // 背景色为黄色
  'blueBG': '\x1B[44m', // 背景色为蓝色
  'magentaBG': '\x1B[45m', // 背景色为品红
  'cyanBG': '\x1B[46m', // 背景色为青色
  'whiteBG': '\x1B[47m' // 背景色为白色
}
/**
 * 打印不同颜色
 */

export const print = {
  log: (text: string) => console.log(`${color.white}> ${color.grey}${text}${color.reset}`),
  danger: (text: string) => console.log(`${color.red}> ${text}${color.reset}`),
  warn: (text: string) => console.log(`${color.yellow}> ${text}${color.reset}`),
  tip: (text: string) => console.log(`${color.cyan}> ${text}${color.reset}`),
}
// 测试用的
// print.danger('danger')
// print.tip('tips')


/**
 * 去除对象中的null值字段
 * @param obj object to remove null value
 * @returns 
 */
export const removeParamsObjectNullValue = (obj: object): any => {
  let result = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const element = obj[key];
      if (element !== null && element !== '') {
        result[key] = element
      }
    }
  }
  return result
}