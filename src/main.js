// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 引入基础配置
import App from'./App';
import Vue from'vue';
import config from'./config/index';

// 引入路由
import router from'./router';

// 引入axios
import axios from'axios';

// 引入vuex状态库
import store from'./store';
import MintUI from'mint-ui';
import'mint-ui/lib/style.min.css';
import'./main.less';
import qs from'qs';

Vue.use(config);
Vue.use(MintUI);
Vue.config.productionTip = false;

// 全局方法 前面需加上 $ 符号来标识
// 需分开挂载，不能一次性挂载
// 异步请求方法
Vue.prototype.$ajax = async function(api, { type = 'get', data, }) {
  let result = {};
  if(type === 'get') {
    result = (await axios.get(String(config.apiHost) + api, {
      params: data,
    })).data;
  }else if(type === 'post') {
    result = (await axios({
      method: type,
      url: String(config.apiHost) + api,
      
      // axios 这个大坑，会将 json 直接转为 string，所以这需要 qs 转为 url 能解析的urlencode编码
      data: qs.stringify(data),
      headers: {
        // 后端不允许 json 跨域
        'content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    })).data;
  }else if(type === 'upload') {
    result = (await axios({
      method: 'post',
      url: String(config.apiHost) + api,
      data: data,
      headers: {
        'content-Type': 'multipart/form-data;',
      },
    })).data;
  }
  return result;
};

/*  eslint no-param-reassign: 0, no-extra-parens: 0 */
// 格式化日期方法
Date.prototype.format = function(format) {
  const o = {
    // 月份
    'M+': this.getMonth() + 1,
    
    // 日
    'd+': this.getDate(),
    
    // 小时
    'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12,
    
    // 小时
    'H+': this.getHours(),
    
    // 分
    'm+': this.getMinutes(),
    
    // 秒
    's+': this.getSeconds(),
    
    // 季度
    'q+': Math.floor((this.getMonth() + 3) / 3),
    
    // 毫秒
    'S': this.getMilliseconds(),
  };
  const week = {
    '0': '/u65e5',
    '1': '/u4e00',
    '2': '/u4e8c',
    '3': '/u4e09',
    '4': '/u56db',
    '5': '/u4e94',
    '6': '/u516d',
  };
  if(/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, String(this.getFullYear()).substr(4 - RegExp.$1.length));
  }
  if(/(E+)/.test(format)) {
    format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '')
      + week[String(this.getDay())]);
  }
  for(const k in o) {
    if(new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length));
    }
  }
  return format;
};

const start = () => {
  /* eslint no-unused-vars: 1 */
  const vue = new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App, },
  });
};

// 手机APP解开下面注释 PC端加上
// document.addEventListener('plusready', () => {
//   start();
// });

// PC端加上下面注释 手机APP解开
start();

