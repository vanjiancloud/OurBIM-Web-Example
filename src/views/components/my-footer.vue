<template>
    <div class="footer">
      <div class="url">
        Copyright © 2021 www.OurBIM.com, All Rights Reserved.
      </div>
      <div class="mobile">{{ $t('servicehotline') }}<br />022-8633-0370</div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.footer {
    width: 100%;
    height: 150px;
    background-color: #fff;
    .url {
      float: left;
      width: 600px;
      height: 50px;
      color: #cccccc;
      margin-top: 85px;
      margin-left: 250px;
    }
    .mobile {
      float: right;
      width: 300px;
      height: 50px;
      color: #cccccc;
      margin-top: 58px;
      margin-right: 50px;
    }
  }
</style>
