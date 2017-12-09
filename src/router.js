import Vue from'vue';
import Router from'vue-router';
import main from'@/components/main';

// 登录模块
import login from'@/components/login';

// 注册模块
import registry from'@/components/registry';

// 四个一级模块
import index from'@/components/main/index';
import hot from'@/components/main/hot';
import search from'@/components/main/search';
import mine from'@/components/main/mine';

// 文章详情
import article from'@/components/article';

// 评论详情
import comment from'@/components/comment';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/main',
      name: 'main',
      component: main,
      children: [
        {
          path: '/index',
          name: 'index',
          component: index,
        }, {
          path: '/hot',
          name: 'hot',
          component: hot,
        }, {
          path: '/search',
          name: 'search',
          component: search,
        }, {
          path: '/mine',
          name: 'mine',
          component: mine,
        },
      ],
    }, {
      path: '/article/:ObjId',
      name: 'article',
      component: article,
    }, {
      path: '/comment/:ObjId',
      name: 'comment',
      component: comment,
    }, {
      path: '/login',
      name: 'login',
      component: login,
    }, {
      path: '/registry',
      name: 'registry',
      component: registry,
    }, {
      path: '/',
      redirect: '/index',
    },
  ],
});
