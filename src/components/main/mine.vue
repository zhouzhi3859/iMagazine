<template>
  <div>
    <input id='uploadLogo' type='file' accept='image/jpg,image/jpeg,image/png' name='image' hidden><br/>
    <div class="topInfo">
      <div class="userLogo"><img :src="logoUrl" alt=""></div>
      <div class="userInfo" :style="'width:' + pageWidth*0.55+'px;left:'+ pageWidth*0.35+'px;' ">
        <p class="username">{{username}}</p>
        <p class="sex">性别：{{sex}}</p>
        <p class="intro">{{intro}}</p>
      </div>
    </div>
    <div class="articleRel">
      <div @click="showComment"><div><img src="../../img/font/comment.png"></div><div>评论</div></div>
      <div @click="showColOrReHr('col')"><div><img src="../../img/font/collect_s.png"></div><div>收藏</div></div>
      <div @click="showColOrReHr('RH')"><div><img src="../../img/font/foot.png"></div><div>足迹</div></div>
    </div>
    <div class="userRel">
      <div @click="showUserPopUp"><div>个人资料</div><div><img src="../../img/font/right.png"></div></div>
      <div @click="quiteLogin"><div>退出登陆</div><div><img src="../../img/font/right.png"></div></div>
      <div @click="showFeedback"><div>反馈</div><div><img src="../../img/font/right.png"></div></div>
      <div @click="showAppInfo"><div>关于</div><div><img src="../../img/font/right.png"></div></div>
    </div>
    <mt-popup v-model="userPopUpVisible" position="right" class="userPopUp">
      <div class="userLogoPop" @click="readyUploadLogo"><img :src="logoUrlBack" alt=""><div>点击头像可更换</div></div>
      <div class="userInfoContainer">
        <div><label>账号：</label><input type="text" class="input" :value="account" disabled></div>
        <div><label>用户名：</label><input type="text" placeholder="用户名" class="input" v-model="username"></div>
        <div><label>手机号：</label><input type="text" placeholder="手机号" class="input" v-model="phone"></div>
        <div v-show="showSmsCode">
          <label>验证码：</label><input type="text" placeholder="请输入短信验证码" class="input" v-model="smsCode" id="smsCode" style="width: 39%;">
          <div style="display: none"></div>
          <mt-button v-if="canGetSmsCode" type="primary" size="small" @click="getSmsCode" style="width: 19%;font-size: 0.7em;transform: translate(0px,-0.5em);">获取验证码</mt-button>
          <mt-button v-if="!canGetSmsCode" type="primary" size="small" style="width: 19%;font-size: 0.7em;transform: translate(0px,-0.1em);">{{getSmsCodeTime}} s</mt-button>
        </div>
        <div><label>性别：</label><input type="text" class="input" :value="sexStr" readonly @click="pickSex"></div>
        <div style="height: 70px;"><label style="transform: translate(2px,-50px);">简介：</label>
          <textarea placeholder="请输入账号" maxlength="140" style="height: 60px;padding-top: 5px;margin-left: -5px;" class="input" v-model="intro"></textarea>
        </div>
        <div><label>出生日期：</label><input type="text" class="input" :value="birth" readonly @click="pickTime"></div>
        <mt-datetime-picker :startDate="startDate" :endDate="endDate" year-format="{value}" month-format="{value}"
          date-format="{value}" style="height: 300px;" ref="pickTime" type="date" v-model="birthSel" @confirm="setBirth">
        </mt-datetime-picker>
        <mt-popup v-model="sexPopUpVisible" popup-transition="popup-fade" position="bottom" style="height: 173px;width: 100%;">
          <mt-radio title="选择性别" v-model="sexSel" :options="['男', '女', '妖怪']"></mt-radio>
        </mt-popup>
      </div>
      <div class="btnContainer" :style="showSmsCode===true?'top:590px;':'top:550px;'">
        <mt-button type="primary" size="small"  class="btn" @click="confirmReset">确认修改</mt-button>
        <mt-button type="danger" size="small"  class="btn" @click="hideUserPopUp">取消</mt-button>
      </div>
    </mt-popup>
    <mt-popup v-model="feedbackPopUpVisible" position="right" class="userPopUp">
      <div class="feedbackContainer">
        <div style="height: 70px;">
          <textarea placeholder="字数限制在5-140字之间。。。" maxlength="140" class="input" minlength="5" v-model="feedback"></textarea>
        </div>
      </div>
      <div class="btnContainer" style="top:60%;'">
        <mt-button type="primary" class="btn" @click="sendFeedback">提交反馈</mt-button>
        <mt-button type="danger" class="btn" @click="hideFeedback">取消</mt-button>
      </div>
    </mt-popup>
    <mt-popup v-model="appInfoPopUpVisible" position="right" class="userPopUp">
      <div class="appInfoContainer">
        <div class="logoCenter"><img src="../../img/logo.jpg" style="width: 200px;height: 200px;"></div>
        <div class="authorContainer">
          <div>版本：{{version}}</div>
          <div>作者：{{author}}</div>
          <div>联系方式：{{connect}}</div>
        </div>
      </div>
    </mt-popup>
    <mt-popup v-model="commentVisible" position="right" class="userPopUp">
      <div v-for="comment in comments" class="commentContainer" @click="jumpToArticle(comment.ObjId)">
        <div class="commentContent">{{comment.content}}</div>
        <div class="commentTitle">{{comment.title}}</div>
        <div class="iconContainer">
          <div><img src="../../img/font/good.png" alt=""></div>
          <div><img src="../../img/font/bad.png" alt=""></div>
        </div>
        <div class="goodAndBad">
          <div>{{comment.good < 1000 ? comment.good : '999+'}}</div>
          <div>{{comment.bad < 1000 ? comment.bad : '999+'}}</div>
        </div>
      </div>
    </mt-popup>
    <mt-popup v-model="colOrReHrVisible" position="right" class="userPopUp">
      <div class="articleListcontainer" v-for="article in colOrReHr" @click="jumpToArticle(article.ObjId)">
        <div class="articleListImgContainer"><img class="articleListImg" :src="article.cover" alt=""></div>
        <div class="articleListTitleContainer" :data-objId="article.cid+''+article.aid"><p class="articleListTitle">{{article.title}}</p></div>
      </div>
    </mt-popup>
    <div v-show="appInfoPopUpVisible" class="backButton" @click="hideAppInfo">
      <img src="../../img/font/back.png" alt="">
    </div>
    <div v-show="commentVisible" class="backButton" @click="hideComment">
      <img src="../../img/font/back.png" alt="">
    </div>
    <div v-show="colOrReHrVisible" class="backButton" @click="hideColOrReHr">
      <img src="../../img/font/back.png" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mine',
    data() {
      return{
        version: '',
        author: '',
        connect: '',
        username: '',
        account: '',
        phone: '',
        smsCode: '',
        showSmsCode: false,
        canGetSmsCode: true,
        getSmsCodeTime: 60,
        sex: '',
        sexSel: '',
        birth: '',
        birthSel: '',
        logoUrl: '',
        logoUrlBack: '',
        intro: '',
        feedback: '',
        startDate: new Date('1970-01-01'),
        endDate: new Date(),
        userPopUpVisible: false,
        sexPopUpVisible: false,
        feedbackPopUpVisible: false,
        appInfoPopUpVisible: false,
        commentVisible: false,
        comments: [],
        colOrReHrVisible: false,
        colOrReHr: [],
      };
    },
    computed: {
      // 宽度
      pageWidth: function() {
        return window.innerWidth;
      },
      sexStr: function() {
        let sexN = '';
        if(this.sex === 0) {
          sexN = '男';
        }else if(this.sex === 1) {
          sexN = '女';
        }else{
          sexN = '妖怪';
        }
        return sexN;
      },
    },
    watch: {
      sex: function() {
        if(this.sex === 0) {
          this.sexSel = '男';
        }else if(this.sex === 1) {
          this.sexSel = '女';
        }else{
          this.sexSel = '妖怪';
        }
      },
      sexSel: function() {
        this.sexPopUpVisible = false;
        if(this.sexSel === '男') {
          this.sex = 0;
        }else if(this.sexSel === '女') {
          this.sex = 1;
        }else{
          this.sex = 2;
        }
      },
    },
    mounted: async function() {
      this.version = this.$store.state.app.version;
      this.author = this.$store.state.app.author;
      this.connect = this.$store.state.app.connect;
      this.$store.state.app.area = this.$route.name;
      
      // 准备页面数据
      this.username = this.$store.state.user.username;
      this.logoUrl = this.$store.state.user.logoUrl;
      this.logoUrlBack = this.$store.state.user.logoUrl;
      const that = this;
      
      // 获取个人信息
      const result = await this.$ajax('/user/getUserInfo', {
        type: 'get', data: { uid: that.$store.state.user.uid, },
      });
      if(result.code < 0) {
        return this.$toast(result.msg);
      }
      
      // 拿到信息
      const{ data, } = result;
      this.account = data.account;
      this.phone = data.phone;
      this.sex = data.sex;
      this.birth = data.birth;
      this.intro = data.intro;
      
      // 点击了input标签就显示验证码输入框
      document.querySelectorAll('.input').forEach((value, index) => {
        value.onblur = function() {
          that.showSmsCode = true;
        };
      });
      
      document.getElementById('uploadLogo').onchange = async function() {
        const formData = new FormData();
        formData.append('img', this.files[0]);
        const upRes = await that.$ajax('/user/userLogo', {
          type: 'upload', data: formData,
        });
        that.$toast(upRes.msg);
        if(upRes.code === 0) {
          that.logoUrlBack = upRes.data;
        }
      };
    },
    methods: {
      // 显示个人资料页
      showUserPopUp: function() {
        this.userPopUpVisible = true;
      },
      
      // 准备上传图片
      readyUploadLogo: function() {
        document.getElementById('uploadLogo').click();
      },
      
      // 显示时间选择器
      pickTime: function() {
        this.birthSel = this.birth;
        this.$refs.pickTime.open();
        
        // 点击modal层则隐藏
        document.querySelector('.v-modal').onclick = function() {
          document.querySelector('.v-modal').style.display = 'none';
        };
      },
      
      // 设置时间
      setBirth: function(time) {
        document.querySelector('.v-modal').style.display = 'none';
        this.$refs.pickTime.close();
        this.birth = (new Date(time).format('yyyy-MM-dd')).toString();
      },
      
      // 显示性别选择页
      pickSex: function() {
        this.sexPopUpVisible = true;
        
        // 点击modal层则隐藏
        document.querySelector('.v-modal').onclick = function() {
          document.querySelector('.v-modal').style.display = 'none';
        };
      },
      
      // 获取短信验证码
      getSmsCode: async function() {
        const phone = String(this.phone);
        if(phone.length === 0) {
          this.$toast('手机号不能为空！');
        }
        const phoneVerify = phone.match(/1[3|4|5|7|8]\d{9}/);
        if(!phoneVerify) {
          this.$toast('请输入正确的手机号！');
        }
        const result = await this.$ajax('/user/getSms', { type: 'get', data: { phone, }, });
        if(result.code < 0) {
          this.$toast(result.msg);
        }else{
          this.canGetSmsCode = false;
          const that = this;
          const timer = setInterval(() => {
            that.getSmsCodeTime--;
            if(that.getSmsCodeTime === 0) {
              that.canGetSmsCode = true;
              that.getSmsCodeTime = 60;
              window.clearInterval(timer);
            }
          }, 1000);
        }
      },
      
      // 隐藏个人资料页
      hideUserPopUp: async function() {
        this.userPopUpVisible = false;
        this.username = this.$store.state.user.username;
        this.logoUrl = this.$store.state.user.logoUrl;
        this.logoUrlBack = this.$store.state.user.logoUrl;
        
        // 获取个人信息
        const result = await this.$ajax('/user/getUserInfo', {
          type: 'get', data: { uid: this.$store.state.user.uid, },
        });
        if(result.code < 0) {
          return this.$toast(result.msg);
        }
        
        // 拿到信息
        const{ data, } = result;
        this.account = data.account;
        this.phone = data.phone;
        this.sex = data.sex;
        this.birth = data.birth;
        this.intro = data.intro;
      },
      
      // 确认修改个人资料
      confirmReset: async function() {
        this.logoUrl = this.logoUrlBack;
        const data = {
          uid: this.$store.state.user.uid,
          username: this.username,
          sex: this.sex,
          birth: this.birth,
          intro: this.intro,
          logoUrl: this.logoUrl,
          phone: this.phone,
          smsCode: this.smsCode,
        };
        const result = await this.$ajax('/user/resetUserInfo', {
          type: 'post', data: data,
        });
        this.$toast(result.msg);
        if(result.code === 0) {
          this.userPopUpVisible = false;
          this.$store.state.user.username = data.username;
          this.$store.state.user.logoUrl = data.logoUrl;
        }
      },
      
      // 退出登陆
      quiteLogin: function() {
        // plus.storage.removeItem('uidSto');
        // plus.storage.removeItem('usernameSto');
        // plus.storage.removeItem('logoUrlSto');
        this.$store.state.user.isLogin = false;
        this.$router.push({ name: 'login', replace: true, });
      },
      
      // 显示反馈页
      showFeedback: function() {
        this.feedbackPopUpVisible = true;
      },
      
      // 隐藏反馈页
      hideFeedback: function() {
        this.feedbackPopUpVisible = false;
        this.feedback = '';
      },
      
      // 提交反馈
      sendFeedback: async function() {
        const{ feedback, } = this;
        if(feedback.length < 5 || feedback.length > 140) {
          return this.$toast('字数限制，请重试！');
        }
        const result = await this.$ajax('/user/sendFeedback', {
          type: 'post', data: { uid: this.$store.state.user.uid, content: this.feedback, },
        });
        this.$toast(result.msg);
        if(result.code === 0) {
          this.feedbackPopUpVisible = false;
        }
      },
      
      // 显示关于页
      showAppInfo: function() {
        this.appInfoPopUpVisible = true;
      },
      
      // 隐藏关于页
      hideAppInfo: function() {
        this.appInfoPopUpVisible = false;
      },
      
      // 显示评论记录页
      showComment: async function() {
        await this.getComment();
        this.commentVisible = true;
      },
      
      // 隐藏评论记录页
      hideComment: function() {
        this.commentVisible = false;
      },
      
      // 获得我的评论
      getComment: async function() {
        const result = await this.$ajax('/user/getCommentByUser', {
          type: 'get', data: { uid: this.$store.state.user.uid, },
        });
        if(result.code < 0) {
          return this.$toast(result.msg);
        }
        this.comments = result.data;
      },
      
      // 显示收藏或阅读记录页
      showColOrReHr: async function(type) {
        await this.getColOrReHr(type);
        this.colOrReHrVisible = true;
      },
      
      // 隐藏收藏或阅读记录页
      hideColOrReHr: function() {
        this.colOrReHrVisible = false;
      },
      
      // 获得收藏或阅读记录
      getColOrReHr: async function(type) {
        let result = {};
        if(type === 'col') {
          result = await this.$ajax('/user/getCollection', {
            type: 'get', data: { uid: this.$store.state.user.uid, },
          });
        }else{
          result = await this.$ajax('/user/getReadHistory', {
            type: 'get', data: { uid: this.$store.state.user.uid, },
          });
        }
        if(result.code < 0) {
          return this.$toast(result.msg);
        }
        this.colOrReHr = result.data;
      },
      
      // 跳转到文章页
      jumpToArticle: function(ObjId) {
        this.$router.push({ name: 'article', params: { ObjId: ObjId.substring(2), }, });
      },
    },
  };
</script>

<style scoped>

  .topInfo {
    width: 100%;
    height: 150px;
    background: #04af50;
    position: absolute;
    top: 0;left: 0;
  }
  
  .userLogo {
    width: 80px; height: 80px;
    border-radius: 50%;
    position: absolute;
    top:30px; left: 10%;
    background: white;
  }
  
  .userLogo img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  
  .userInfo {
    height: 80px;
    position: absolute;
    top: 25px;
    z-index: 100;
    color: white;
  }
  
  .username {
    margin: 13px 0;
    text-align: left;
    text-indent: 0;
    font-size: 24px;
  }
  
  .intro {
    text-align: left;
    text-indent: 0;
    width: 230px;
    font-size: 12px;
  }
  
  .sex {
    text-align: left;
    text-indent: 0;
    font-size: 12px;
  }
  
  .articleRel {
    width: 96%;
    height: 60px;
    position: absolute;
    top: 135px;left: 2%;
    background: white;
    border: 1px solid #bbb;
    box-shadow: 1px 1px 2px 1px #bbbbbb;
    border-radius: 5px;
  }

  .articleRel>div {
    display: inline-block;
    width: 32%;
    height: 60px;
  }

  .articleRel>div>div:first-child {
    width: 100%;
    height: 60%;
  }
  
  .articleRel>div>div>img {
    width: 24px;
    height: 24px;
    margin-top: 7px;
  }
  
  .userRel {
    width: 100%;
    height: 120px;
    position: absolute;
    top: 205px;left: 0;
  }
  
  .userRel>div {
    height: 44px;
    position: relative;
    border-bottom: 1px solid #bbb;
  }

  .userRel>div:first-child {
    border-top: 1px solid #bbb;
  }

  .userRel>div>div:first-child {
    width: 50%;
    height: 44px;
    line-height: 44px;
    position: absolute;
    top: 0;left: 10px;
    text-align: left;
  }

  .userRel>div>div:last-child {
    width: 44px;
    height: 44px;
    line-height: 44px;
    position: absolute;
    top: 0;right: 10px;
  }

  .userRel>div>div:last-child>img {
    width: 26px;
    height: 26px;
    margin-top: 8px;
  }
  
  .userPopUp {
    width: 100%;
    height: 100%;
    background: white;
    overflow-y: scroll;
  }
  
  .userLogoPop {
    width: 100%;
    height: 200px;
    background: #04af50;
  }

  .userLogoPop>img {
    border-radius: 50%;
    width: 120px;height: 120px;
    margin-top: 20px;
  }

  .userLogoPop>div {
    text-align: center;
    color: white;
    margin-top: 10px;
    font-size: 14px;
  }

  .userInfoContainer {
    height: 120px;
    margin-top: 20px;
  }

  .userInfoContainer>div {
    height: 40px;
    margin-top: 10px;
  }
  

  .userInfoContainer>div>label {
    font-size: 0.7em;
    width: 60px;
    text-align: right;
    display: inline-block;
  }

  .userInfoContainer>div>.input {
    height: 29px;width: 59%;
    margin: 0;padding: 0;
    padding-left: 10px;
    border: 2px solid #bbb;
    border-radius: 5px;
  }

  .userInfoContainer>div>input:focus {
    border: 2px solid #26a2ff;
    border-radius: 5px;
  }

  .btnContainer {
    position: absolute;
    width: 100%;
    left: 50%;
    transform: translate(-50%,0px);
    margin-top: 15px;
    padding-bottom: 20px;
    text-align: center;
  }

  .btn {
    margin-left: 10px;
    padding: 10px 20px;
    font-size: 0.7em;
  }
  
  .feedbackContainer {
    position: absolute;
    width: 100%;
    top: 40%;left: 50%;
    transform: translate(-50%, -50%);
  }

  .feedbackContainer>div>textarea {
    height: 100px;
    padding-top: 5px;
    margin-left: -5px;width: 80%;
    border-radius: 7px;
    box-shadow: 1px 1px 1px 1px #bbb;
  }
  
  .logoCenter {
    width:200px;height: 200px;
    position: absolute;
    top: 160px;left: 50%;
    transform: translate(-50%,-50%);
  }

  .authorContainer {
    width: 100%;
    position: absolute;
    top: 320px;
  }
  
  .authorContainer>div {
    margin-top: 10px;
    font-size: 15px;
    font-style: italic;
  }
  
  .commentContainer {
    border: 1px solid #bbb;
    position:relative;
    border-radius:3px;
    box-shadow: 2px 2px 2px #bbbbbb;
    margin: 5px 0;
    height: 80px; width: 99%;
  }

  .commentContainer>.commentContent {
    position: absolute;
    top: 10px;
    font-size: 18px;
    width: 80%;
    height: 50px;
    overflow-y: hidden;
  }
  
  .commentContainer>.commentTitle {
    position: absolute;
    top: 55px;
    font-size: 14px;
    width: 80%;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
  }

  .commentContainer>.iconContainer {
    position: absolute;
    top: 5px;left: 77%;
    width: 15%;
    height: 70px;
  }

  .commentContainer>.iconContainer>div {
    margin-top: 10px;
  }
  
  .commentContainer>.iconContainer>div>img {
    width: 20px;
    height: 20px;
  }

  .commentContainer>.goodAndBad {
    position: absolute;
    top: 5px;left: 85%;
    width: 15%;
    height: 70px;
  }

  .commentContainer>.goodAndBad>div {
    margin-top: 13px;
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
  
  .backButton {
    position: fixed;
    width: 40px;
    height: 40px;
    z-index:  10000;
    right: 40px;
    bottom: 40px;
  }
  
</style>
