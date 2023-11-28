import { IApiInfoResponse } from '../typing/yapi'
import { getConfigRootPath } from './config'
import { http } from './http'
import fs from 'fs'
import path from 'path'

/**
 * @description 下划线转驼峰
 * @author Wynne
 * @date 2021-06-25
 * @export
 * @param name
 * @param [isBigHump=false] 是否大驼峰
 * @return {*}
 */
export function underlineToHump(name: string, isBigHump = false): string {
  let hump = name.replace(/[_|\-|\s](\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
  hump =
    (isBigHump
      ? hump.charAt(0).toLocaleUpperCase()
      : hump.charAt(0).toLocaleLowerCase()) + hump.substr(1)
  return hump
}

/**
 * @description 获取项目名称
 * @author bqliuyang
 * @date 2023-11-28
 */
export function getProjectName(): string {
  if (!fs.existsSync(path.resolve(getConfigRootPath(), './package.json'))) {
    throw new Error('当前目录下没有package.json文件' + getConfigRootPath())
  }
  const fileData = fs.readFileSync(
    path.resolve(getConfigRootPath(), './package.json'),
    'utf-8',
  )
  const jsonData = JSON.parse(fileData)

  return underlineToHump(jsonData.name)
}

/**
 * @description 接口path路径变为驼峰
 * @author Wynne
 * @date 2021-07-01
 * @export
 * @param api
 * @param [isBigHump=true]
 * @return {*}
 */
export function pathToHump(api: IApiInfoResponse, isBigHump = true): string {
  let name = api.path.replace(/[{|}]/g, '').replace(/\//g, '_')
  name = underlineToHump(name, isBigHump)
  return name
}

/**
 * @description 获取接口的Response名字
 * @author Wynne
 * @date 2021-07-01
 * @export
 * @param api
 * @return {*}
 */
export function getResponseName(api: IApiInfoResponse): string {
  const name = pathToHump(api)
  const method =
    api.method.slice(0, 1).toUpperCase() +
    api.method.slice(1).toLocaleLowerCase()
  return `I${method}${name}Response`
}

/**
 * @description 获取接口的Params名字
 * @author Wynne
 * @date 2021-07-01
 * @export
 * @param api
 * @return {*}
 */
export function getRequestName(api: IApiInfoResponse): string {
  const name = pathToHump(api)
  const method =
    api.method.slice(0, 1).toUpperCase() +
    api.method.slice(1).toLocaleLowerCase()
  return `I${method}${name}Request`
}

/**
 * @description 获取接口的Query名字
 * @author Wynne
 * @date 2021-07-01
 * @export
 * @param api
 * @return {*}
 */
export function getQueryName(api: IApiInfoResponse): string {
  const name = pathToHump(api)
  const method =
    api.method.slice(0, 1).toUpperCase() +
    api.method.slice(1).toLocaleLowerCase()
  return `I${method}${name}Query`
}

/**
 * @description 获取命名空间
 * @author Wynne
 * @date 2021-07-01
 * @export
 * @return {*}
 */
export function getNamespace(projectName: string): string {
  return underlineToHump(projectName, true)
}

/**
 * @description 获取接口Query声明文件地址
 * @author Wynne
 * @date 2021-07-01
 * @export
 * @return {*}
 */
export function getQueryPath(namespace: string, api: IApiInfoResponse): string {
  return `${namespace}.Request.${getQueryName(api)}`
}

/**
 * @description 获取Body声明文件路径
 * @author Wynne
 * @date 2021-07-01
 * @export
 * @param namespace
 * @param api
 * @return {*}
 */
export function getBodyPath(namespace: string, api: IApiInfoResponse): string {
  return `${namespace}.Request.${getRequestName(api)}`
}

/**
 * @description 获取Respones声明文件路径
 * @author Wynne
 * @date 2021-07-01
 * @export
 * @param namespace
 * @param api
 * @return {*}
 */
export function getResponesPath(
  namespace: string,
  api: IApiInfoResponse,
): string {
  return `${namespace}.Response.${getResponseName(api)}`
}

/**
 * @description 通过path生成接口名字
 * @author Wynne
 * @date 2021-07-01
 * @export
 * @param api
 * @return {*}
 */
export function getInterfaceName(api: IApiInfoResponse): string {
  const name = pathToHump(api)
  return `${api.method.toLocaleLowerCase()}${name}`
}
