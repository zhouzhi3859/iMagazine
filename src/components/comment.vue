<template>
  <div class="container">
    <div class="hotCommentContainer">
      <div class="commentCate">
        <div class="commentCateImg"><img src="../img/font/hot.png"></div>
        <div class="commentCateTitle"><h2>热门评论</h2></div>
      </div>
      <div v-if="hotCommentRes.code!==0" class="commentCateMsg">{{hotCommentRes.msg}}</div>
      <div v-if="hotCommentRes.code===0" v-for="comment in hotCommentRes.data" class="comment">
        <div class="commentAuthor">
          <div class="authorLogo"><img :src="comment.logoUrl" alt=""></div>
          <div class="authorName">{{comment.author}}</div>
          <div class="commentLoc">{{comment.region + comment.city}}网友</div>
          <div class="commentTime">{{comment.time.substring(5, 16)}}</div>
        </div>
        <div class="commentContent"><p>{{comment.content}}</p></div>
        <div class="goodOrBad">
          <div class="goodIcon"><img src="../img/font/good.png" alt="" @click="estimateComment(comment.cid, 0, 0)"></div><div class="goodNum">{{comment.good < 1000 ? comment.good : '999+'}}</div>
          <div class="badIcon"><img src="../img/font/bad.png" alt="" @click="estimateComment(comment.cid, 1, 0)"></div><div class="badNum">{{comment.bad < 1000 ? comment.bad : '999+'}}</div>
        </div>
      </div>
    </div>
    <div class="commentContainer">
      <div class="commentCate">
        <div class="commentCateImg"><img src="../img/font/all.png"></div>
        <div class="commentCateTitle"><h2>全部评论</h2></div>
      </div>
      <div v-if="commentRes.code!==0" class="commentCateMsg">{{commentRes.msg}}</div>
      <div v-if="commentRes.code===0" v-for="comment in commentRes.data" class="comment">
        <div class="commentAuthor">
          <div class="authorLogo"><img :src="comment.logoUrl" alt=""></div>
          <div class="authorName">{{comment.author}}</div>
          <div class="commentLoc">{{comment.region + comment.city}}网友</div>
          <div class="commentTime">{{comment.time.substring(5, 16)}}</div>
        </div>
        <div class="commentContent"><p>{{comment.content}}</p></div>
        <div class="goodOrBad">
          <div class="goodIcon"><img src="../img/font/good.png" alt="" @click="estimateComment(comment.cid, 0, 1)"></div><div class="goodNum">{{comment.good < 1000 ? comment.good : '999+'}}</div>
          <div class="badIcon"><img src="../img/font/bad.png" alt="" @click="estimateComment(comment.cid, 1, 1)"></div><div class="badNum">{{comment.bad < 1000 ? comment.bad : '999+'}}</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <span class="input" :style="'width:'+pageWidth+'px;'" @click="showComment">写评论</span>
      <span class="iconContainer" :style="'left:'+(pageWidth+10)+'px;'"><img src="../img/font/comment.png" class="icon"></span>
      <mt-badge size="small" :style="'position:absolute;top:10px;left:'+(pageWidth+48)+'px;'">{{commentNum}}</mt-badge>
      <span class="backTop" @click="backTop"><img src="../img/font/top.png" alt=""></span>
    </div>
    <div class="mask" @click="hideComment"></div>
    <div class="commentInput">
      <textarea v-model="commentContent" rows="4" maxlength="140" placeholder="评论不得超过140字" id="input"></textarea>
      <div><mt-button type="primary" size="small" class="btn-right" @click="comment">发表评论</mt-button></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'comment',
    data() {
      return{
        hotCommentRes: {},
        commentRes: {},
        commentNum: 0,
        commentContent: '',
      };
    },
    computed: {
      // 宽度
      pageWidth: function() {
        return(window.innerWidth - 200);
      },
    },
    mounted: async function() {
      const{ ObjId, } = this.$route.params;
      const res1 = await this.$ajax('/article/getCommentByArticle', {
        type: 'get', data: { ObjId: ObjId, },
      });
      this.commentRes = res1;
      this.commentNum = res1.data ? res1.data.length : 0;
      const res2 = await this.$ajax('/article/getHotCommentByArticle', {
        type: 'get', data: { ObjId: ObjId, },
      });
      this.hotCommentRes = res2;
    },
    methods: {
      // 显示评论区
      showComment: function() {
        this.clickBox = false;
        const mask = document.querySelector('.mask');
        mask.style.opacity = 0;
        mask.style.display = 'block';
        const comment = document.querySelector('.commentInput');
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
        const comment = document.querySelector('.commentInput');
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
        const{ uid, logoUrl, username, } = this.$store.state.user;
        const{ ObjId, } = this.$route.params;
        const comment = this.commentContent;
        if(comment.length === 0) {
          return this.$toast('评论不能为空！');
        }
        const result = await this.$ajax('/article/comment', {
          type: 'post', data: { uid, ObjId, comment, },
        });
        if(result.code === 0) {
          this.commentRes.data.unshift({
            logoUrl: logoUrl,
            author: username,
            ...result.data,
          });
        }
        this.$toast(result.msg);
      },
      
      // 点赞或反对评论
      estimateComment: async function(cid, type, res) {
        const result = await this.$ajax('/article/estimateComment', {
          type: 'post', data: { cid: cid, type: type, },
        });
        if(res === 0) {
          for(let i = 0;i < this.hotCommentRes.data.length;i++) {
            if(cid === this.hotCommentRes.data[i].cid) {
              if(type === 0) {
                this.hotCommentRes.data[i].good += 1;
              }else{
                this.hotCommentRes.data[i].bad += 1;
              }
            }
          }
        }else{
          for(let i = 0;i < this.commentRes.data.length;i++) {
            if(cid === this.commentRes.data[i].cid) {
              if(type === 0) {
                this.commentRes.data[i].good += 1;
              }else{
                this.commentRes.data[i].bad += 1;
              }
            }
          }
        }
      },
      
      // 回到顶部
      backTop: function() {
        let scrollLen = document.querySelector('.container').scrollTop;
        const timer1 = setInterval(() => {
          if(scrollLen > 0) {
            scrollLen -= 5;
            document.querySelector('.container').scrollTop = scrollLen;
          }else{
            document.querySelector('.container').scrollTop = 0;
            clearInterval(timer1);
          }
        }, 1);
      },
    },
  };
</script>

<style scoped>

  .hotCommentContainer {
    border-bottom: 1px solid #bbb;
    box-shadow: 0px 2px 2px #bbb;
    min-height: 120px;
  }
  
  .commentCate {
    height: 35px;
    position: relative;
    border-bottom: 1px solid #bbb;
    margin-bottom: 10px;
  }
  
  .commentCateImg {
    position: absolute;
    width: 25px; height: 25px;
    left: 10px;top: 5px;
  }
  
  .commentCateImg>img {
    width: 25px; height: 25px;
  }

  .commentCateTitle {
    position: absolute;
    width: 80%; height: 35px;
    line-height: 35px;
    left: 10px;top: 5px;
  }

  .commentCateTitle>h2 {
    margin: 0;
    text-align: left;
    padding-left: 35px;
    font-size: 16px;
    height: 30px;line-height: 30px;
  }
  
  .commentCateMsg {
    width: 100%;
    height: 65px;
    line-height: 65px;
    font-style: italic;
    font-weight: bold;
    font-size: 18px;
    color: #118dff;
  }
  
  .commentContainer {
    margin-top: 10px;
    margin-bottom: 50px;
  }
  
  .comment {
    width: 100%;
    height: 120px;
    margin-bottom: 5px;
  }

  .commentAuthor {
    position: relative;
    height: 30px;
  }

  .commentAuthor>div {
    position: absolute;
    height: 30px;
  }
  
  .authorLogo {
    width: 30px;
    left: 5px;top: 0;
  }

  .authorLogo>img {
    width: 30px;
    height: 30px;
    border-radius: 15px;
  }
  
  .authorName {
    left: 35px;top: 7px;
    width: 60px;
    overflow-x: hidden;
  }

  .commentLoc {
    left: 130px;top: 8px;
    font-size: 13px;
  }
  
  .commentTime {
    right: 20px;top: 11px;
    font-size: 13px;
  }
  
  .commentContent {
    height: 60px;
  }
  
  .goodOrBad {
    height: 30px;
    position: relative;
  }

  .goodOrBad>div {
    position: absolute;
    height: 20px;
  }

  .goodOrBad>div>img {
    width: 20px;
    height: 20px;
  }
  
  .goodIcon {
    right: 120px;
    top: 5px;
  }
  
  .goodNum {
    top: 7px;right: 77px;
    width: 40px;
  }
  
  .badIcon {
    right: 50px;
    top: 5px;
  }

  .badNum {
    top: 7px;right: 7px;
    width: 40px;
  }

  .footer {
    position: fixed;
    width: 100%;height: 35px;
    bottom: 0;
    box-shadow: 0 -1px 1px 1px #bbb;
    padding-top: 5px;
    background: white;
  }

  .footer>.input {
    position: absolute;
    left: 5px;
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
    top: 5px;
    position: absolute;
  }

  .footer>.iconContainer>.icon {
    width: 26px;height: 26px;
    margin-top: 2px;
    margin-left: 10px;
  }

  .footer>.backTop {
    width: 30px;height: 30px;
    top: 7px;right: 30px;
    position: absolute;
  }

  .footer>.backTop>img {
    width: 20px;
    height: 20px;
  }

  .commentInput {
    width: 100%; height: 160px;
    position: fixed;
    left: 0;bottom: -165px;
    background: white;
    z-index: 1001;
  }

  .commentInput textarea {
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
