<template>
  <div>
    <div class="top"><h2>大家都在看</h2></div>
    <div class="articleListcontainer" v-for="article in articleList" @click="jumpToDetail(article.cid+''+article.aid)">
      <div class="articleListImgContainer"><img class="articleListImg" :src="article.cover" alt=""></div>
      <div class="articleListTitleContainer" :data-objId="article.cid+''+article.aid"><p class="articleListTitle">{{article.title}}</p></div>
    </div>
  </div>
</template>

<script>
  export default {
    created: async function() {
      const result = await this.$ajax('/article/getHotArticle', {
        type: 'get',
      });
      if(result.code < 0) {
        return this.$toast(result.msg);
      }
      this.articleList = result.data;
    },
    data() {
      return{
        articleList: [],
      };
    },
    methods: {
      // 转到详情页
      jumpToDetail: function(ObjId) {
        if(!this.$store.state.user.isLogin && this.selected !== 'index') {
          return this.$router.push({ name: 'login', });
        }
        this.$router.push({ name: 'article', params: { ObjId: ObjId, }, });
      },
    },
    mounted: function() {
      this.$store.state.app.area = this.$route.name;
    },
    name: 'hot',
  };
</script>

<style scoped>
  
  .top {
    position: absolute;
    width: 100%;
    height: 50px;
    line-height: 50px;
    top: 0;left: 0;
    background: #118dff;
  }

  .top h2 {
    text-align: left;
    margin: 0;
    color: white;
    padding-left: 15px;
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
