<template>
  <div class="container">
    <div class="box">
      <div class="write">
        <h4>
          您好：example@vanjian.com：
          <br />
          感写您注册OurBIM！为激活您的账户，请点击下面按钮以验证您的电子邮件地址：
        </h4>
      </div>
      <div class="btn">
        <button class="button">激活账户</button>
      </div>
      <div class="duanluo">
        <h4>如果上述按钮点击无效，请将以下链接粘贴到您的浏览器：</h4>
        <br />
        <h4 style="color:#8AC0FF">https://ourbim.com/activate?code=Z4achPO-iL=signup</h4>
        <br />
        <h4>
          如您需要获取额外的帮助，请访问我们的<a href="" style="color:#8AC0FF"
            >支持中心。</a
          >
        </h4>
        <br />
        <h4>祝您试用OurBIM愉快！</h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
}
.container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f4;
}
.box {
  width: 550px;
  height: 350px;
  border-radius: 10px;
  background-color: #fff;
  padding: 50px 50px;
}
.btn {
  text-align: center;
  margin: 40px 0;
}
.button {
  background-color: #00aaf0;
  color: white;
  width: 150px;
  height: 50px;
  border-radius: 10px;
  font-size: 16px;
  border: none;
}
</style>
