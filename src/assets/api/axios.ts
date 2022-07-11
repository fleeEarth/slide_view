
import axios from "axios";
import { ElNotification } from "element-plus";

const BaseUrl = '/api'
// let BaseUrl = 'http://192.168.1.49:8080/jtcsm'

export default function httpSend(url:string,params: any ,type:string) {

    url = BaseUrl + url;
  // 1. 定义promise对象
  let promise : any;
 

  axios.defaults.withCredentials=true;
  // request拦截器

  axios.interceptors.request.use((config : any) => {

      config.headers['Content-Type'] = 'application/json;charset=UTF-8';      
      return config
  }, error => {

      Promise.reject(error)
  });

  return new Promise((resolve,reject) =>{
      // 2. 判断请求的方式
      if('GET' === type){
          
          // 2.1 拼接请求字符串
          let paramsStr = '';
          Object.keys(params).forEach(key=>{
              paramsStr += (key +'='+ params[key] + '&')
          })
          if(paramsStr !== ''){
              // 2.2 过滤最后的&
              paramsStr = paramsStr.substr(0,paramsStr.lastIndexOf('&'));
          }
          // 2.3 完整路径
          url += ('?' + paramsStr);
      

          promise = axios.get(url);
      }else if('POST' == type){
        

          promise = axios.post(url,params);
          
      }
      // 3. 返回请求的结果
      promise.then((response:any)=>{
         
        if(response.data.code != 200){
            ElNotification({
                title:'错误',
                message:response.data.msg,
                type:'error',
                duration:1000
            })
          
            
            throw new Error(response.data.msg);
        }
        resolve(response.data.data);

       
      }).catch((error: any)=>{      
          reject(error)
          return ;
      })
     
  })
}