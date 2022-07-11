import httpSend from "./axios";
/**
 * 获取验证码图片
 * @returns 
 */
export const getSlideImage = () =>
  httpSend("/verifyService/slideImage", {}, "GET");
/**
 * 校验验证码
 * @param params 
 * @returns 
 */
export const verifyCodeCheck = (params: {offset:number}) =>
  httpSend("/verifyService/verifyCodeCheck", params, 'POST')