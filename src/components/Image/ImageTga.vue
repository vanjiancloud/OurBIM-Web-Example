<template>
  <div>
    <el-image :src="imgPath" fit="fill" style="height: 100%;width: 100%;">
      <div slot="placeholder" class="image-slot">
        <i class="el-icon-plus plusIcon"></i>
      </div>
      <div slot="error" class="image-slot">
        <i class="el-icon-plus plusIcon"></i>
      </div>
    </el-image>
  </div>
</template>

<script>
const libtga = require('libtga').default; // 仅当模块导出为ES6 default时需要
export default {
  name: 'ImageTga',
  props: {
    value: {
      type: String,
      // default: 'https://api.ourbim.com:11023/vjapi/userMaterialMap/Materials_PBR/T_Flat_Normal.png'
      default: '',
    }
  },
  watch: {
    value: {
      async handler(val) {
        if (val) {
          if (val.toLowerCase().endsWith('.tga')) {
            this.imgPath = await this.parseTgaFile(val) || '#';
          } else {
            this.imgPath = val || '#';
          }
        } else {
          this.imgPath = '#'
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      imgPath: '',
    };
  },
  created() {
  },
  methods: {
    async parseTgaFile(source) {
      try {
        let arrayBuffer;
        if (typeof source === 'string') {
          // 新增：处理在线URL的情况
          const response = await fetch(source);
          if (!response.ok) throw new Error(`HTTP错误：${response.status}`);
          arrayBuffer = await response.arrayBuffer();
        } else {
          // 原有逻辑：处理本地File对象
          arrayBuffer = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(source);
          });
        }

        // 原有解析逻辑（不变）
        const tgaInstance = libtga.readFile(arrayBuffer);
        const canvas = document.createElement('canvas');
        canvas.width = tgaInstance.width;
        canvas.height = tgaInstance.height;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(tgaInstance.width, tgaInstance.height);
        imageData.data.set(tgaInstance.imageData);
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png');
      } catch (error) {
        console.error('解析TGA文件失败:', error);
        return '#'; // 解析失败时返回无效 URL
      } finally {
      }
    },
  }
};
</script>
<style lang="less" scoped></style>