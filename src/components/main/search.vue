<template>
  <div>
    <div class="top-search">
      <mt-search v-model="key" cancel-text="取消" placeholder="搜索">
      </mt-search>
    </div>
    <div class="hotkey" v-show="showHotKey">
      <div class="hotkeyTitleLeft">大家都在搜</div>
      <img src="../../img/font/refresh.png" style="width: 16px;height: 13px;position: absolute;top:20px;right: 50px;">
      <div class="hotkeyTitleRight" @click="getHotKey">换一批</div>
      <div class="cut"></div>
      <div class="hotkeys">
        <div v-for="key in hotKey" @click="hotKeyHandler(key)">{{key}}</div>
      </div>
    </div>
    <div class="keyRecommend" v-show="showRecommend">
      <div class="recommendItem" v-for="keyRecommend in keyRecommends" @click="recommendHandler(keyRecommend)">{{keyRecommend}}</div>
    </div>
    <div class="result" v-show="isSearched">
      <div class="articleListcontainer" v-for="article in result" @click="jumpToDetail(article.cid+''+article.aid)">
        <div class="articleListImgContainer"><img class="articleListImg" :src="article.cover" alt=""></div>
        <div class="articleListTitleContainer" :data-objId="article.cid+''+article.aid"><p class="articleListTitle">{{article.title}}</p></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'search',
    data() {
      return{
        key: '',
        hotKey: [],
        isSearched: false,
        isSearching: false,
        showHotKey: true,
        showRecommend: false,
        keyRecommends: [],
        result: [],
      };
    },
    computed: {},
    watch: {
      key: async function() {
        this.result = [];
        
        // 隐藏热搜词
        this.showHotKey = false;
        
        // 显示搜索推荐
        this.showRecommend = true;
        const result = await this.$ajax('/article/getKeyRecommend', {
          type: 'get', data: { key: this.key, },
        });
        if(result.code < 0) {
          const keyArr = [];
          keyArr.push(result.msg);
          this.keyRecommends = keyArr;
        }else{
          this.keyRecommends = result.data;
        }
      },
    },
  
    mounted: async function() {
      const that = this;
      that.$store.state.app.area = that.$route.name;
      await that.getHotKey();
      const input = document.querySelector('.mint-searchbar-core');
      const cancel = document.querySelector('.mint-searchbar-cancel');
      input.onblur = () => {
        // 隐藏取消按钮
        cancel.style.display = 'none';
        window.onclick = (e) => {
          if(e.target.getAttribute('class') !== 'recommendItem') {
            // 隐藏搜索推荐
            that.showRecommend = false;
          }
        };
        if(that.key.length === 0) {
          // 显示热搜词
          that.showHotKey = true;
          
          // 隐藏搜索结果
          that.isSearched = false;
        }else{
          // 隐藏热搜词
          that.showHotKey = false;
          
          // 显示搜索结果
          that.isSearched = true;
        }
      };
      input.onfocus = () => {
        cancel.style.display = 'block';
        input.onkeydown = (e) => {
          if(e.keyCode === 13) {
            that.search(that.key);
          }
        };
        cancel.onclick = () => {
          that.key = '';
        };
      };
    },
    methods: {
      // 获得热搜词
      getHotKey: async function() {
        let result = await this.$ajax('/article/getHotKey', {
          type: 'get',
        });
        if(result.code < 0) {
          return this.$toast(result.msg);
        }
        this.hotKey = result.data;
      },
      
      // 点击下面热搜词时
      hotKeyHandler: async function(key) {
        this.key = key;
        await this.search(key);
      },
      
      // 点击搜索建议
      recommendHandler: async function(key) {
        this.key = key;
        await this.search(key);
        
        // 隐藏搜索推荐
        this.showRecommend = false;
      },
      
      // 搜索
      search: async function(key) {
        let result = await this.$ajax('/article/search', {
          type: 'get', data: { uid: this.$store.state.user.uid, key: key, },
        });
        if(result.code < 0) {
          return this.$toast(result.msg);
        }
        this.result = result.data;
        
        // 显示搜索结果
        this.isSearched = true;
        
        // 隐藏热搜词
        this.showHotKey = false;
        
        // 隐藏搜索推荐
        this.showRecommend = false;
      },
  
      // 转到详情页
      jumpToDetail: function(ObjId) {
        this.$router.push({ name: 'article', params: { ObjId: ObjId, }, });
      },
    },
  };
</script>

<style scoped>


  
  .top-search {
    position: absolute;
    height: 52px;
    width: 100%;
    left: 0;
    top: 0;
  }
  
  
  .hotkey {
    position: relative;
  }

  .hotkey>.hotkeyTitleLeft {
    height: 20px;
    position: absolute;
    left: 10px;
    top: 20px;
    font-size: 12px;
  }

  .hotkey>.hotkeyTitleRight {
    height: 20px;
    position: absolute;
    right: 10px;
    top: 20px;
    font-size: 12px;
  }
  
  .cut {
    width: 100%;
    box-shadow: 0 1px 1px 1px #bbb;
    padding-top: 45px;
  }
  
  .hotkeys {
    display: flex;
    width: 98%;
    margin: 10px 1% 0 1%;
    flex-wrap: wrap;
  }

  .hotkeys>div {
    margin-right: 10px;
    margin-bottom: 8px;
    font-size: 14px;
    border: 1px solid #999;
    border-radius: 15px;
    padding: 5px;
  }
  
  .keyRecommend {
    width: 100%;
    position: absolute;
    left: -1px;
    top: 44px;
    padding-bottom: 5px;
    border: 1px solid #aaa;
    z-index: 10;
    background: white;
  }

  .keyRecommend div {
    width: 94%;
    margin-left: 2%;
    padding-left: 10px;
    margin-top: 5px;
    text-align: left;
  }

  .keyRecommend div:hover {
    background: #118dff;
    color: white;
  }

  .articleListcontainer {
    position:relative;
    border-radius:3px;
    border: 1px solid #bbb;
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
    text-align: center;
    display: block;
    transform: translate(-50%,-50%)
  }
  
</style>
