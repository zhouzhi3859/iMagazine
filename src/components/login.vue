<template>
  <div>
    <div class="logoCenter"><img src="../img/logo.jpg" style="width: 200px;height: 200px;"></div>
    <div class="login">
      <div><input type="text" placeholder="请输入账号或者手机号" class="input" v-model="accountOrPhone"></div>
      <div><input type="password" placeholder="请输入密码" class="input" v-model="pwd"></div>
      <div>
        <div class="btnContainer">
          <mt-button type="danger" size="small" @click="registry" class="btn">没有账号？点此注册</mt-button>
          <mt-button type="primary" size="small" @click="login" class="btn">登陆</mt-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  
  export default {
    name: 'login',
    data() {
      return{
        accountOrPhone: '',
        pwd: '',
      };
    },
    created: function() {
      // 从本地存储中取得
      // const uidSto = plus.storage.getItem('uidSto');
      // const usernameSto = plus.storage.getItem('usernameSto');
      // const logoUrlSto = plus.storage.getItem('logoUrlSto');
      // if(uidSto && !this.$store.state.user.isLogin) {
      //   this.$store.state.user.isLogin = true;
      //   this.$store.state.user.uid = uidSto;
      //   this.$store.state.user.username = usernameSto;
      //   this.$store.state.user.logoUrl = logoUrlSto;
      //   this.$toast({
      //     message: '自动登陆成功！',
      //     iconClass: 'icon icon-success',
      //     duration: 1000,
      //   });
      //   this.$router.push({ name: 'index', replace: true, });
      // }else{
      //   this.$toast('请先登录！');
      // }
    },
    methods: {
      // 跳转到注册页面
      registry: function() {
        this.$router.push({ name: 'registry', replace: true, });
      },
      
      // 登陆
      login: async function() {
        const that = this;
        const{ accountOrPhone, pwd, } = that;
        if(accountOrPhone.length === 0) {
          return that.$toast('请输入账号或者手机号！');
        }
        if(pwd.length === 0) {
          return that.$toast('请输入密码！');
        }
        const result = await that.$ajax('/user/login', { type: 'post', data: { accountOrPhone, pwd, }, });
        if(result.code < 0) {
          return that.$toast(result.msg);
        }
        const{ data, } = result;
        
        // 设置回本地存储
        // plus.storage.setItem('uidSto', data.uid);
        // plus.storage.setItem('usernameSto', data.username);
        // plus.storage.setItem('logoUrlSto', data.logoUrl);
        that.$store.state.user.isLogin = true;
        that.$store.state.user.username = data.username;
        that.$store.state.user.uid = data.uid;
        that.$store.state.user.logoUrl = data.logoUrl;
        setTimeout(() => {
          that.$toast({
            message: '登陆成功！',
            iconClass: 'icon icon-success',
            duration: 1000,
          });
          this.$router.push({ name: 'index', replace: true, });
        }, 1000);
      },
    },
  };
  
</script>

<style scoped>

  .logoCenter {
    width:200px;height: 200px;
    position: absolute;
    top: 160px;left: 50%;
    transform: translate(-50%,-50%);
  }
  
  .login {
    height: 120px;
    margin-top: 350px;
  }
  
  .login>div {
    height: 40px;
    margin-top: 5px;
  }

  .login>div>.input {
    height: 29px;width: 66%;
    margin: 0;padding: 0;
    padding-left: 10px;
    border: 1px solid #bbb;
    border-radius: 5px;
  }

  .login>div>input:focus {
    border: 2px solid #26a2ff;
    border-radius: 5px;
  }

  .btnContainer {
    margin-top: 15px;
    text-align: center;
  }

  .login>div>div.btnContainer>.btn {
    margin-left: 10px;
  }

</style>
