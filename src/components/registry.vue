<template>
  <div>
    <div class="logoCenter"><img src="../img/logo.jpg" style="width: 200px;height: 200px;"></div>
    <div class="registry">
      <div><label>账号：</label><input type="text" placeholder="请输入账号" class="input" v-model="account" id="account"></div>
      <div v-if="accountErr" class="errInfo"><p>{{accountErrInfo}}</p></div>
      <div><label>密码：</label><input type="password" placeholder="请输入密码" class="input" v-model="pwd" id="pwd"></div>
      <div v-if="pwdErr" class="errInfo"><p>{{pwdErrInfo}}</p></div>
      <div><label>用户名：</label><input type="text" placeholder="请输入用户名" class="input" v-model="username" id="username"></div>
      <div v-if="usernameErr" class="errInfo"><p>{{usernameErrInfo}}</p></div>
      <div><label>手机号：</label><input type="text" placeholder="请输入手机号码" class="input" v-model="phone" id="phone"></div>
      <div v-if="phoneErr" class="errInfo"><p>{{phoneErrInfo}}</p></div>
      <div><label>验证码：</label><input type="text" placeholder="请输入短信验证码" class="input" v-model="smsCode" id="smsCode"></div>
      <div v-if="smsCodeErr" class="errInfo"><p>{{smsCodeErrInfo}}</p></div>
      <div>
        <div class="btnContainer">
          <mt-button style="width: 90px;" type="danger" size="small" @click="getSmsCode" class="btn" v-if="canGetSmsCode">获取验证码</mt-button>
          <mt-button style="width: 90px;" type="danger" size="small" @click="getSmsCode" class="btn" disabled v-if="!canGetSmsCode"><span>{{getSmsCodeTime}}</span> 秒后重发</mt-button>
          <mt-button type="primary" size="small" @click="registry" class="btn">确认注册</mt-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  
  export default {
    name: 'registry',
    data() {
      return{
        account: '',
        pwd: '',
        username: '',
        phone: '',
        smsCode: '',
        canGetSmsCode: true,
        getSmsCodeTime: 60,
        accountErr: false,
        accountErrInfo: '',
        pwdErr: false,
        pwdErrInfo: '密码不能为空！',
        usernameErr: false,
        usernameErrInfo: '用户名不能为空',
        phoneErr: false,
        phoneErrInfo: '',
        smsCodeErr: false,
        smsCodeErrInfo: '验证码不能为空',
      };
    },
    watch: {
    },
    mounted: function() {
      const that = this;
      const account = document.getElementById('account');
      const pwd = document.getElementById('pwd');
      const username = document.getElementById('username');
      const phone = document.getElementById('phone');
      const smsCode = document.getElementById('smsCode');
      
      // input 失去焦点后就将提示信息隐藏
      account.onblur = function() {
        that.accountErr = false;
      };
      pwd.onblur = function() {
        that.pwdErr = false;
      };
      username.onblur = function() {
        that.usernameErr = false;
      };
      phone.onblur = function() {
        that.phoneErr = false;
      };
      smsCode.onblur = function() {
        that.smsCodeErr = false;
      };
    },
    methods: {
      // 获取短信验证码
      getSmsCode: async function() {
        const that = this;
        const{ phone, } = that;
        if(phone.length === 0) {
          that.phoneErr = true;
          that.phoneErrInfo = '手机号不能为空！';
          return document.getElementById('phone').focus();
        }
        const phoneVerify = phone.match(/1[3|4|5|7|8]\d{9}/);
        if(!phoneVerify) {
          that.phoneErr = true;
          that.phoneErrInfo = '请输入正确的手机号！';
          return document.getElementById('phone').focus();
        }
        const data = await that.$ajax('/user/getSms', { type: 'get', data: { phone, }, });
        if(data.code < 0) {
          that.$toast(data.msg);
        }else{
          that.canGetSmsCode = false;
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
      
      // 校验当前页面所有 input
      validate: function() {
        const that = this;
        
        // 校验账号
        const{ account, pwd, username, phone, smsCode, } = that;
        if(account.length === 0) {
          that.accountErr = true;
          that.accountErrInfo = '账号不能为空！';
          
          // 聚焦到当前 input
          return document.getElementById('account').focus();
        }
        if(!(account.match(/^[a-zA-Z]+\d+/))) {
          that.accountErr = true;
          that.accountErrInfo = '账号必须以大小写字母开头，并包含有数字！';
          
          // 聚焦到当前 input
          return document.getElementById('account').focus();
        }
        
        // 校验密码
        if(pwd.length === 0) {
          that.pwdErr = true;
          
          // 聚焦到当前 input
          return document.getElementById('pwd').focus();
        }
        if(pwd.length < 6) {
          that.pwdErr = true;
          that.pwdErrInfo = '密码至少为6位！';
          
          // 聚焦到当前 input
          return document.getElementById('pwd').focus();
        }
        
        // 校验用户名
        if(username.length === 0) {
          that.usernameErr = true;
          
          // 聚焦到当前 input
          return document.getElementById('username').focus();
        }
        
        // 校验手机号
        if(phone.length === 0) {
          that.phoneErr = true;
          that.phoneErrInfo = '手机号不能为空！';
          
          // 聚焦到当前 input
          return document.getElementById('phone').focus();
        }
        const phoneVerify = phone.match(/1[3|4|5|7|8]\d{9}/);
        if(!phoneVerify) {
          that.phoneErr = true;
          that.phoneErrInfo = '请输入正确的手机号！';
          
          // 聚焦到当前 input
          return document.getElementById('phone').focus();
        }
        
        // 校验验证码
        if(smsCode.length === 0) {
          that.smsCodeErr = true;
          
          // 聚焦到当前 input
          return document.getElementById('smsCode').focus();
        }
      },
      
      // 注册
      registry: async function() {
        const that = this;
        that.validate();
        const result = await that.$ajax('/user/registry', {
          type: 'post',
          data: {
            account: that.account,
            pwd: that.pwd,
            username: that.username,
            phone: that.phone,
            smsCode: that.smsCode,
          },
        });
        if(result.code < 0) {
          return that.$toast(result.msg);
        }
        if(result.code === 0) {
          setTimeout(() => {
            that.$toast({
              message: '注册成功，跳转到首页！',
              iconClass: 'icon icon-success',
              duration: 1000,
            });
            const{ data, } = result;
            
            // 设置回本地存储
            // plus.storage.setItem('uidSto', data.uid);
            // plus.storage.setItem('usernameSto', data.username);
            // plus.storage.setItem('logoUrlSto', data.logoUrl);
            that.$store.state.user.isLogin = true;
            that.$store.state.user.uid = data.uid;
            that.$store.state.user.username = data.username;
            that.$store.state.user.logoUrl = data.logoUrl;
            that.$router.push({ name: 'index', replace: true, });
          }, 1000);
        }
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
  
  .registry {
    height: 120px;
    margin-top: 320px;
  }
  
  .registry>div {
    height: 40px;
    margin-top: 5px;
  }

  .registry>div.errInfo {
    height: 16px;
    margin-top: -4px;
  }

  .registry>div.errInfo>p {
    color: red;
    text-align: center;
    font-size: 0.7em;
    height: 18px;line-height: 18px;
    text-indent: 0.3em;
    margin-top: -5px;
  }
  
  .registry>div>label {
    font-size: 0.7em;
    width: 50px;
    text-align: right;
    display: inline-block;
  }
  
  .registry>div>.input {
    height: 29px;width: 59%;
    margin: 0;padding: 0;
    padding-left: 10px;
    border: 2px solid #bbb;
    border-radius: 5px;
  }
  
  .registry>div>input:focus {
    border: 2px solid #26a2ff;
    border-radius: 5px;
  }
  
  .btnContainer {
    margin-top: 15px;
    text-align: center;
  }

  .registry>div>div.btnContainer>.btn {
    margin-left: 10px;
    font-size: 0.7em;
  }
  
</style>
