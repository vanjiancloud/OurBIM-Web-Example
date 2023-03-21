// url转blob
export function urlToblob(url,func) {
  var canvas = document.createElement("canvas"); // 创建一个画板
  const image = new Image();
  image.setAttribute("crossOrigin", "Anonymous"); // 可能会有跨越问题
  image.src = url;
  image.onload = async () => {
    // img加载完成事件
    canvas.width = image.width; // 设置画板宽度
    canvas.height = image.height; // 设置画板高度
    canvas.getContext("2d").drawImage(image, 0, 0); // 加载img到画板
    canvas.toBlob(blob=>{
        func(blob)
    },'image/png')
  };
}
