<template>
  <div class="demo" id="bigbox">
    dwwwwwwwwwww
    <div>
      <span>
        <button>1</button>
      </span>
      <span>
        <button>2</button>
      </span>
      <span>
        <button>3</button>
      </span>
    </div>
    <div>
      <ul>
        <li>
          <div class="one"></div>
        </li>
        <li>
          <div class="two"></div>
        </li>
        <li>
          <div class="three"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// 获取tab栏最外面的大盒子
var bigbox = document.getElementById('bigbox')

// 获取tab栏的标题栏，就是最外面大盒子里的第一个div
var hd = bigbox.getElementsByTagName('div')[0]

// 获取tab栏的内容部分，就是最外面的带盒子里的第二个div
var dd = bigbox.getElementsByTagName('div')[1]

// 获取标题栏hd里面的所有span
var spans = hd.getElementsByTagName('span')

// 获取内容栏dd里面到底所有li
var list = dd.getElementsByTagName('li')

// 循环遍历每一个span
for (var i = 0; i < spans.length; i++) {
  // 再点击之前先获取span的索引，并存入自定义属性index中
  spans[i].setAttribute('index', i)
  // 为每一个span添加点击事件
  spans[i].onclick = function () {
    // 移除所有的span的类样式 ，不然会导致点击一个添加一个类样式，所有的都被点击，多有的都有类样式
    // 排他==========先去除所有span的类样式之后再给当前被点击的添加类样式
    for (var j = 0; j < spans.length; j++) {
      spans[j].removeAttribute('class')
    }
    // 给当前被点击的span添加current样式
    this.className = 'current'
    // span 标签被点击的时候存储当前的索引值，就可以找到对应li
    // 获取被点击的span的索引值
    var num = this.getAttribute('index')
    // 循环遍历每一个li,将其的类样式去除
    for (var k = 0; k < list.length; k++) {
      list[k].removeAttribute('class')
    }
    // 点击的span对应的li添加类样式
    list[num].className = 'current'
  }
}
export default {}
</script>

<style lang="less" scoped>
.demo {
  width: 600px;
  height: 400px;
  background-color: palevioletred;
  .one {
    width: 300px;
    height: 100px;
    background-color: red;
  }
  .two {
    width: 300px;
    height: 100px;
    background-color: skyblue;
  }
  .three {
    width: 300px;
    height: 100px;
    background-color: greenyellow;
  }
}
</style>
