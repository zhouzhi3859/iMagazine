<template>
  <div>
    <div v-show="loaded" class="articleContainer" :style="'height:'+pageHeight+';'">
      <div><h2 class="title" style="margin-bottom: 5px;">{{detail.title}}</h2></div>
      <div><span class="author" style="font-size: 10px;">{{detail.author}}</span>&nbsp;&nbsp;<span class="time" style="font-size: 10px;">{{new Date(detail.time).format("yyyy-MM-dd HH:mm:ss")}}</span></div>
      <div class="newsBg" v-show="detail.newsBg">{{detail.newsBg}}</div>
      <div id="content" style="margin-top: 15px;"></div>
    </div>
    <div v-show="clickBox" class="footer">
      <span class="input" :style="'width:'+pageWidth+'px;'" @click="showComment">写评论</span>
      <span class="iconContainer" :style="'left:'+(pageWidth+10)+'px;'"><img src="../img/font/comment.png" class="icon" @click="jumpToComment"></span>
      <mt-badge size="small" style="margin-left: 42px">{{detail.commentNum}}</mt-badge>
      <span v-show="detail.isCollected!==0" class="iconContainer" :style="'left:'+(pageWidth+85)+'px;'">
        <img src="../img/font/collect.png" class="icon" @click="collect">
      </span>
      <span v-show="detail.isCollected===0" class="iconContainer" :style="'left:'+(pageWidth+85)+'px;'">
        <img src="../img/font/collect_s.png" class="icon" @click="cancelCollect">
      </span>
      <span class="iconContainer" :style="'left:'+(pageWidth+145)+'px;'"><img src="../img/font/share.png" class="icon"></span>
    </div>
    <div class="mask" @click="hideComment"></div>
    <div class="comment">
      <textarea v-model="commentContent" rows="4" maxlength="140" placeholder="评论不得超过140字" id="input"></textarea>
      <div><mt-button type="primary" size="small" class="btn-right" @click="comment">发表评论</mt-button></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'article',
    data() {
      return{
        detail: '',
        loaded: false,
        clickBox: false,
        commentContent: '',
      };
    },
    computed: {
      // 响应式高度
      pageHeight: function() {
        return(window.innerHeight - 48) + 'px';
      },
      
      // 宽度
      pageWidth: function() {
        return(window.innerWidth - 200);
      },
    },
    watch: {

    },
    mounted: async function() {
      const that = this;
      
      // 获取文章
      that.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle',
      });
      const{ ObjId, } = that.$route.params;
      const result = await that.$ajax('/article/article', {
        type: 'get',
        data: {
          uid: that.$store.state.user.uid, ObjId: ObjId,
        }, });
      if(result.code < 0) {
        that.$indicator.close();
        return that.$toast(result.msg);
      }
      const{ data, } = result;
      this.detail = data;
      const content = document.getElementById('content');
      content.innerHTML = data.content;
      setTimeout(() => {
        that.$indicator.close();
        that.loaded = true;
        that.clickBox = true;
      }, 800);
    },
    methods: {
      // 显示评论区
      showComment: function() {
        this.clickBox = false;
        const mask = document.querySelector('.mask');
        mask.style.opacity = 0;
        mask.style.display = 'block';
        const comment = document.querySelector('.comment');
        let opacity = 0;
        let bottom = -165;
        comment.style.bottom = bottom + 'px';
        const showComment = () => {
          const sbottom = comment.style.bottom;
          if(Number(sbottom.substring(0, sbottom.indexOf('px'))) < 0) {
            bottom += 15;
            comment.style.bottom = bottom + 'px';
            requestAnimationFrame(showComment);
          }
        };
        const showMask = () => {
          if(opacity < 0.7) {
            opacity += 0.05;
            mask.style.opacity = opacity;
            requestAnimationFrame(showMask);
          }
        };
        requestAnimationFrame(showMask);
        requestAnimationFrame(showComment);
      },
      
      // 隐藏评论区
      hideComment: function() {
        const mask = document.querySelector('.mask');
        const comment = document.querySelector('.comment');
        let opacity = 0.7;
        let bottom = 0;
        comment.style.bottom = bottom + 'px';
        const hideComment = () => {
          const sbottom = comment.style.bottom;
          if(Number(sbottom.substring(0, sbottom.indexOf('px'))) > -165) {
            bottom -= 15;
            comment.style.bottom = bottom + 'px';
            requestAnimationFrame(hideComment);
          }
        };
        const hideMask = () => {
          if(opacity > 0) {
            opacity -= 0.05;
            mask.style.opacity = opacity;
            requestAnimationFrame(hideMask);
          }
        };
        requestAnimationFrame(hideMask);
        requestAnimationFrame(hideComment);
        mask.style.display = 'none';
        this.clickBox = true;
      },
      
      // 发表评论
      comment: async function() {
        const{ uid, } = this.$store.state.user;
        const{ ObjId, } = this.detail;
        const comment = this.commentContent;
        if(comment.length === 0) {
          return this.$toast('评论不能为空！');
        }
        const result = await this.$ajax('/article/comment', {
          type: 'post', data: { uid, ObjId, comment, },
        });
        this.$toast(result.msg);
        if(result.code === 0) {
          this.hideComment();
          this.detail.commentNum += 1;
        }
      },
      
      // 跳转到评论页
      jumpToComment: function() {
        const{ ObjId, } = this.detail;
        this.$router.push({ name: 'comment', params: { ObjId: ObjId, }, });
      },
      
      // 收藏
      collect: async function() {
        const{ ObjId, } = this.detail;
        const{ uid, } = this.$store.state.user;
        const result = await this.$ajax('/article/collectArticle', {
          type: 'post', data: { ObjId, uid, },
        });
        this.$toast(result.msg);
        if(result.code === 0) {
          this.detail.isCollected = 0;
        }
      },
      
      // 取消收藏
      cancelCollect: async function() {
        const{ ObjId, } = this.detail;
        const{ uid, } = this.$store.state.user;
        const result = await this.$ajax('/article/cancelCollectArticle', {
          type: 'post', data: { ObjId, uid, },
        });
        this.$toast(result.msg);
        if(result.code === 0) {
          this.detail.isCollected = -1;
        }
      },
    },
  };
  
</script>

<style scoped>

  .articleContainer {
    position: absolute;
    width: 96%;
    top: 0;
    overflow-y: scroll;
  }
  
  .newsBg {
    width: 90%;
    margin-left: 5%;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 5px;
    background: #ccc;
    box-shadow: 3px 3px 3px #bbb;
    font-size: 12px;
    text-align: justify;
    padding: 5px;
    line-height: 18px;
  }
  
  .footer {
    position: absolute;
    height: 30px;
    bottom: 9px;left: 5px;
  }

  .footer>.input {
    display: inline-block;
    height: 22px;
    padding-top: 6px;
    font-size: 10px;
    color: white;
    border-radius: 3px;
    border: 1px solid #bbb;
    background: #bbb;
  }
  
  .footer>.iconContainer {
    width: 30px;height: 30px;
    top: 0;
    position: absolute;
  }
  
  .footer>.iconContainer>.icon {
    width: 26px;height: 26px;
    margin-top: 2px;
    margin-left: 10px;
  }
  
  .comment {
    width: 100%; height: 160px;
    position: fixed;
    left: 0;bottom: -165px;
    background: white;
    z-index: 1001;
  }

  .comment textarea {
    width: 93%; height: 90px;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid #bbb;
    font-size: 1.3em;
  }
  
  .btn-right {
    float: right;
    margin-top: 8px;
    margin-right: 3.5%;
  }
  
</style>
