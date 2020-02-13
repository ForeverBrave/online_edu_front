<template>
  <div class="main">
    <div class="title">
      <a class="active" href="/login">登录</a>
      <span>·</span>
      <a href="/register">注册</a>
    </div>

    <div class="sign-up-container">
      <form v-on:submit.prevent="doSubmit()" action="register">
        <div class="input-prepend restyle">
          <input type="text" placeholder="手机号" v-model="result.mobile">
          <i class="iconfont icon-phone"/>
        </div>
        <div class="input-prepend">
          <input type="password" placeholder="密码" v-model="result.password">
          <i class="iconfont icon-password"/>
        </div>
        <div class="btn">
          <button type="submit" class="sign-in-button"><span>登录</span></button>
        </div>
      </form>
      <!-- 更多登录方式 -->
      <div class="more-sign">
        <h6>社交帐号登录</h6>
        <ul>
          <li><a id="weixin" class="weixin" target="_blank" href="http://localhost:8003/api/ucenter/wx/login"><i class="iconfont icon-weixin"/></a></li>
          <li><a id="qq" class="qq" target="_blank" href="#"><i class="iconfont icon-qq"/></a></li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import '~/assets/css/sign.css'
import '~/assets/css/iconfont.css'
import member from "@/api/member"

export default {
  layout: 'sign',
  data() {
    return {
      result:{
        mobile:'',
        password:''
      }
    }
  },
  created() {
    
  },
  methods: {
    doSubmit(){
      member.loginUser(this.result)
        .then(response => {
          console.log("登录成功");
        })
        .catch(response => {
          console.log("登录失败");
        })
    }
  }
}

</script>
