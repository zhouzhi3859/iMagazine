<template>
  <div id='app'>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    // 初始数据
    return{
      routes: [
        'index', 'hot', 'search', 'mine',
      ],
      canQuit: false,
    };
  },
  methods: {
  },
  watch: {
  },
  mounted: function() {
    const that = this;
    
    // 监听返回键
    plus.key.addEventListener('backbutton', function() {
      const routerName = that.$route.name;
      if(routerName === 'index' && !that.canQuit) {
        that.canQuit = true;
        const quitToast = that.$toast('再点击一次确认退出！');
        setTimeout(() => {
          quitToast.close();
          that.canQuit = false;
        }, 2000);
      }else if(routerName === 'index' && that.canQuit) {
        plus.runtime.quit();
      }else if(routerName !== 'index') {
        that.$router.go(-1);
      }
    });
  },
};
</script>

<style scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

</style>
