function setRem () {
  const htmlWidth =
    document.documentElement.clientWidth || document.body.clientWidth
  const htmlDom = document.querySelector('html')
  htmlDom.style.fontSize = htmlWidth / 20 + 'px'
}
setRem()
window.onresize = function () {
  setRem()
}
