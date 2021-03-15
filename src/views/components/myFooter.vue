<template>
  <div class="footer">
    <div class="container">
      <div class="wenzi">
        <div>
          Copyright © 2021 www.OurBIM.com, All Rights Reserved.
        </div>
        <div>022-8633-0370</div>
        <div class="last">
          <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank"
            >津ICP备15006036号-2</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.footer {
  width: 100%;
  height: 115px;
  // padding: 20px 0px;
  background-color: #000;
  display: flex;
  align-items: center;
  .wenzi {
    color: #999;
    text-align: center;
    font-size: 14px;
    div {
      margin-bottom: 8px;
    }
    .last {
      margin: 0;
      a {
        color: #999;
        text-decoration: none;
      }
    }
  }
}
</style>
