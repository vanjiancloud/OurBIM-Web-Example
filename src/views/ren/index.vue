<template>
  <div class="wrapper">
    <div class="box1"></div>
    <div class="box2"></div>
    <div class="box3"></div>
    <div class="box4"></div>
    <div class="box5"></div>
  </div>
</template>
<script>
export default {}
</script>
<style></style>
<style>
* {
  margin: 0;
  padding: 0;
}
</style>
<style scoped>
.wrapper div {
  height: 1rem;
}
.box1 {
  /* 750 * 20% */
  width: 150px;
  background-color: coral;
}
.box2 {
  /* 750 * 40% */
  width: 300px;
  background-color: skyblue;
}
.box3 {
  /* 750 * 60% */
  width: 450px;
  background-color: palegreen;
}
.box4 {
  /* 750 * 80% */
  width: 600px;
  background-color: wheat;
}
.box5 {
  /* 750 * 100% */
  width: 750px;
  background-color: darkred;
}
</style>
