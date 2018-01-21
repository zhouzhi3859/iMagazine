<template>
  <div>
    <div :style="'height: '+routerViewHeight+';margin-top:-10px;overflow-y: scroll;margin-left: 8px;margin-right: 8px;'"><router-view></router-view></div>
    <mt-tabbar v-model='selected' fixed>
      <mt-tab-item id='index'>
        <img slot='icon' v-show='selected==="index"' src='../img/font/index_s.png'>
        <img slot='icon' v-show='selected!=="index"' src='../img/font/index.png'>
        首页
      </mt-tab-item>
      <mt-tab-item id='hot'>
        <img slot='icon' v-show='selected==="signUp"' src='../img/font/hot_s.png'>
        <img slot='icon' v-show='selected!=="signUp"' src='../img/font/hot.png'>
        热门
      </mt-tab-item>
      <mt-tab-item id='search'>
        <img slot='icon' v-show='selected==="search"' src='../img/font/search_s.png'>
        <img slot='icon' v-show='selected!=="search"' src='../img/font/search.png'>
        发现
      </mt-tab-item>
      <mt-tab-item id='mine'>
        <img slot='icon' v-show='selected==="mine"' src='../img/font/mine_s.png'>
        <img slot='icon' v-show='selected!=="mine"' src='../img/font/mine.png'>
        个人中心
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
  export default {
    name: 'main',
    data() {
      return{
        selected: '',
        themList: [],
      };
    },
    watch: {
      selected: function() {
        if(!this.$store.state.user.isLogin) {
          if(this.selected !== 'index') {
            return this.$router.push({ name: 'login', });
          }
        }
        this.$store.state.app.area = this.selected;
        this.$router.push({ path: this.selected, });
      },
      '$route': function() {
        const routerName = this.$route.name;
        if(routerName === 'index' || 'hot' || 'search' || 'mine') {
          this.selected = routerName;
        }
      },
    },
    computed: {
      // 响应式高度
      routerViewHeight: function() {
        const wh = (window.innerHeight - 105) + 'px';
        return wh;
      },
    },
    mounted: async function() {
      const that = this;
      that.selected = that.$store.state.app.area;
      const data = await this.$ajax('/article/themList', { type: 'get', });
      this.themList = data.data;
    },
    methods: {
    },
  };
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  a {

  }

  .mint-tabbar>a.mint-tab-item.is-selected {
    background: #118dff;
  }
  .mint-tab-item-icon {
    width: 20px;
    height: 20px;
  }

  .mint-tabbar>a.mint-tab-item.is-selected>.mint-tab-item-label{
    color: white;
  }

</style>
