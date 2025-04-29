export default {
  watch: {
    visible(val) {
      if (!val) {
        const dragDom = this.$el.querySelector('.el-dialog');
        let width = dragDom.style.width;
        if (width.includes('%')) {
          width = +document.body.clientWidth * (+width.replace(/\%/g, '') / 100);
        } else {
          width = +width.replace(/\px/g, '');
        }
        const left = (document.body.clientWidth - width) / 2;
        setTimeout(() => {
          dragDom.style.cssText = 'margin-top: ' + this.style.marginTop + ';position: absolute;left: ' + left + 'px;width:' + this.style.width;
        }, 200);
      }
    }
  },
  mounted() {
    const dragDom = this.$el.querySelector('.el-dialog'),
      dialogHeaderEl = this.$el.querySelector('.el-dialog__header');
    dialogHeaderEl.style.cursor = 'move';
    dialogHeaderEl.querySelector('.el-dialog__title').style.userSelect = 'none';
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
    dragDom.style.position = 'absolute';
    let width = dragDom.style.width;
    if (width.includes('%')) {
      width = +document.body.clientWidth * (+width.replace(/\%/g, '') / 100);
    } else {
      width = +width.replace(/\px/g, '');
    }
    dragDom.style.left = `${(document.body.clientWidth - width) / 2}px`;

    let disX, disY, styL, styT;
    const onMouseMove = (e) => {
      const offsetLeft = e.clientX - disX;
      const offsetTop = e.clientY - disY;
      let finallyL = offsetLeft + styL;
      let finallyT = offsetTop + styT;
      // 边界值处理
      if (finallyL < 0) {
        finallyL = 0;
      } else if (finallyL > document.body.clientWidth - dragDom.offsetWidth) {
        finallyL = document.body.clientWidth - dragDom.offsetWidth;
      }

      const elHeaderHeight = document.querySelector('.el-dialog__header').offsetHeight,
        ContainerHeight = document.body.clientHeight, marginTopPx = Math.ceil(parseFloat(this.style.marginTop) * ContainerHeight / 100);

      if (finallyT < elHeaderHeight - marginTopPx) {
        finallyT = elHeaderHeight - marginTopPx;
      } else if (finallyT > ContainerHeight - dragDom.offsetHeight - marginTopPx) {
        finallyT = ContainerHeight - dragDom.offsetHeight - marginTopPx;
      }

      dragDom.style.left = `${finallyL}px`;
      dragDom.style.top = `${finallyT}px`;

    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    const onMouseDown = (e) => {
      disX = e.clientX - dialogHeaderEl.offsetLeft;
      disY = e.clientY - dialogHeaderEl.offsetTop;
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
      } else {
        styL = +sty.left.replace(/\px/g, '');
        styT = +sty.top.replace(/\px/g, '');
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    dialogHeaderEl.addEventListener('mousedown', onMouseDown);

    this.$once('hook:beforeDestroy', () => {
      dialogHeaderEl.removeEventListener('mousedown', onMouseDown);
    });
  }
};