import appInfo from'../../package.json';

const state = {
  // app 版本
  version: appInfo.version,
  
  // 作者
  author: appInfo.author,
  
  // 联系方式
  connect: appInfo.email,
  
  // 当前页面层级 0 - 第一级  1 - 第二层  2 - 第三层
  status: 0,
  
  // 当前所处区域
  area: 'index',
};

const mutations = {

};

const actions = {

};

export default {
  state,
  mutations,
  actions,
};
