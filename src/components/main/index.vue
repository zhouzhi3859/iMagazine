<template>
  <div id='index'>
    <div class="tbarcontainer">
      <mt-navbar v-model='selected'>
        <mt-tab-item v-for="item in themList" :key="item.cid" :id="item.cid">{{item.them}}</mt-tab-item>
      </mt-navbar>
    </div>
    <div class="tbarcontainerBackUp"></div>
    <mt-loadmore id="articleList" :top-method="refresh"  :auto-fill="false" ref="loadmore" v-infinite-scroll="loadMore" :infinite-scroll-disabled="allowLoad" infinite-scroll-distance="10">
      <div class="articleListcontainer" v-for="article in articleList" @click="jumpToDetail(article.cid+''+article.aid)">
        <div class="articleListImgContainer"><img class="articleListImg" :src="article.cover" alt=""></div>
        <div class="articleListTitleContainer" :data-objId="article.cid+''+article.aid"><p class="articleListTitle">{{article.title}}</p></div>
      </div>
    </mt-loadmore>
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return{
      msg: 'Welcome to Your Vue.js App',
      selected: '01',
      themList: [
        {
          cid: '01', them: '封面故事',
        }, {
          cid: '02', them: '时政',
        }, {
          cid: '03', them: '经济',
        }, {
          cid: '04', them: '调查',
        }, {
          cid: '05', them: '人物',
        }, {
          cid: '06', them: '特稿',
        }, {
          cid: '07', them: '往事',
        }, {
          cid: '08', them: '观点',
        }, {
          cid: '09', them: '生活',
        }, {
          cid: '10', them: '图片故事',
        }, {
          cid: '11', them: '观察', },
      ],
      articleList: [],
      startIndex: 1,
      canQuit: false,
      allowLoad: false,
    };
  },
  created: async function() {
    const that = this;
    
    // 最开始便去请求第一个主题的文章列表
    const result = await that.$ajax('/article/articleList', { type: 'get', data: { cid: '01', start: that.startIndex, }, });
    if(result.code !== 0) {
      return this.$toast('获取文章列表失败！');
    }
    const{ data, } = result;
    this.articleList = data;
  },
  mounted: function() {
    const that = this;
    that.$store.state.app.area = that.$route.name;
  },
  methods: {
    // 转到详情页
    jumpToDetail: function(ObjId) {
      if(!this.$store.state.user.isLogin) {
        return this.$router.push({ name: 'login', replace: true, });
      }
      this.$router.push({ name: 'article', params: { ObjId: ObjId, }, });
    },
    
    // 刷新
    refresh: async function() {
      const that = this;
      const result = (await that.$ajax('/article/articleList', { type: 'get', data: { cid: that.selected, start: 1, }, })).data;
      if(result.code !== 0) {
        // 固定方法，查询完要调用一次，用于重新定位
        that.$refs.loadmore.onTopLoaded();
        return that.$toast('已经是最新的了！');
      }
      const{ data, } = result;
      that.articleList = data;
      
      // 固定方法，查询完要调用一次，用于重新定位
      that.$refs.loadmore.onTopLoaded();
    },
    
    // 加载更多
    loadMore: function() {
      const that = this;
      that.startIndex += 10;
      setTimeout(async() => {
        const{ data, } = (await this.$ajax('/article/articleList', { type: 'get', data: { cid: that.selected, start: that.startIndex, }, }));
        that.allLoaded = true;
        if(data.length === 0) {
          return that.$toast('已经到底了！');
        }
        that.articleList = that.articleList.concat(data);
      }, 1000);
    },
  },
  watch: {
    // 主题不同时请求不同的文章列表
    selected: async function() {
      const cid = this.selected;
      const{ data, } = (await this.$ajax('/article/articleList', { type: 'get', data: { cid: cid, }, }));
      this.articleList = data;
      this.startIndex = 1;
    },
  },
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

  .tbarcontainer {
    overflow-x: scroll;
    position: fixed;
    top: 0;
    left:0;
    width: 100%;
    background-color: white;
    z-index: 100;
    margin-left: 8px;
    margin-right: 8px;
  }

  .tbarcontainerBackUp {
    z-index: -1;
    position: absolute;
    top: 0;
    left:0;
    width: 100%;
    height: 48px;
  }

  #index div.mint-navbar {
    width: 660px;
  }
  
  #index a.mint-tab-item {
    display: inline-block;
    width: 60px;
    height: 18px;
    line-height: 18px;
    padding: 15px 0;
  }
  
  .articleListcontainer {
    border: 1px solid #bbb;
    position:relative;
    border-radius:3px;
    box-shadow: 2px 2px 2px #bbbbbb;
    margin: 5px 0;
    height: 80px; width: 99%;
  }
  
  .articleListImgContainer {
    position:absolute;
    left:5px; top:5px;
    display: inline-block;
    width: 70px; height: 70px;
  }
  
  .articleListImg {
    display: block;
    width: 70px; height: 70px;
  }
  
  .articleListTitleContainer {
    font-size:14px;
    position:absolute;
    left:80px;
    display: inline-block;
    width: 72%; height: 70px;
    text-align:center;
    margin: 5px;
  }

  .articleListTitle {
    position:absolute;
    top:35px; left:50%;
    width:100%;
    line-height: 30px;
    display: block;
    transform: translate(-50%,-50%)
  }
</style>
