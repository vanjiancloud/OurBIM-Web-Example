<template>
  <div>
    <!-- <el-popover placement="bottom" title="标题" width="200" trigger="click" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
      <div slot="reference" class="dashed-plus-box">
        <el-image v-if="false"></el-image>
        <i class="el-icon-plus"></i>
      </div>
    </el-popover> -->
    <div class="dashed-plus-box" @click="openMaps">
      <ImageTga v-model="value" style="height: 100%;width: 100%;" v-if="value"/>
      <i class="el-icon-plus" v-else></i>
      <div class="deleteChartlet" @click.stop="deleteChartlet">
        <i class="el-icon-delete"></i>
      </div>
    </div>
    <el-dialog title="选择贴图文件" :visible.sync="dialogVisible" width="580px" :modal="false" append-to-body>
      <div class="bread"><span @click="back()" :class="groupName && 'dialogName'">{{ dialogName }}</span><span
          v-if="groupName"> / {{ groupName }}</span></div>
      <el-row>
        <el-col :span="4" v-for="(item, index) in tableData" :key="item.groupId">
          <div class="row_item" @click="handleClick(item)">
            <el-image :src="isGroup ? item.imgPath : item.pngPath" class="defaultImg" fit="fill">
              <div slot="error" class="image-slot">
                <img :src="require('@/assets/default/list1.png')" />
              </div>
            </el-image>
            <span style="display: block;">{{ item.groupName }}</span>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Getuserid } from "@/store/index.js";
import { list, textureList, deleteMaterialTexture } from '@/api/resource/chartlet.js'
import ImageTga from '@/components/Image/ImageTga.vue'

export default {
  components: {
    ImageTga
  },
  props: {
    value: {
      type: String,
      default: 'https://api.ourbim.com:11023/vjapi/userMaterialMap/Materials_PBR/T_Flat_Normal.png'
    }
  },
  data() {
    return {
      dialogVisible: false,
      isGroup: false,
      tableData: [],
      dialogName: '用户贴图库',
      groupName: null,
    };
  },
  created() {

  },
  methods: {
    openMaps() {
      this.dialogVisible = true;
      this.getList()
    },
    close() {
      this.dialogVisible = false;
      this.isGroup = false;
      this.groupName = null;
      this.tableData = [];
    },
    getList() {
      let params = {
        userId: Getuserid()
      }
      list(params).then(res => {
        this.isGroup = true
        this.tableData = res.data || []
      }).catch(() => {
        this.tableData = []
      })
    },
    handleClick(item) {
      if (item.isGroup == '1') {
        this.groupName = item.groupName;
        this.getTextureList(item);
      }
      if (item.isGroup == '0') {
        this.$emit('input', item.imgPath);
        this.close();
      }
    },
    // 分组下的贴图
    getTextureList({ groupId }) {
      let params = {
        userId: Getuserid(),
        groupId
      }
      textureList(params).then(res => {
        this.isGroup = false
        this.tableData = res.data || []
      }).catch(() => {
        this.tableData = []
      })
    },
    back() {
      this.getList();
    },
    // 删除贴图
    deleteChartlet(key) {
      this.$confirm('您要删除此贴图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$emit('input', '');
      }).catch(() => { });
    },
  }
};
</script>
<style lang="less" scoped>
.bread {
  margin-bottom: 20px;

  .dialogName {
    cursor: pointer;

    &:hover {
      color: #5a9cf8;
    }
  }
}

.row_item {
  display: flex;
  flex-flow: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-bottom: 8px;
}

.dashed-plus-box {
  width: 60px;
  /* 宽度 */
  height: 60px;
  cursor: pointer;
  background-color: #fcfcfc;
  /* 高度 */
  border: 1px dashed #ccc;
  /* 虚线边框，颜色浅灰 */
  border-radius: 8px;
  /* 圆角 */
  display: flex;
  /* 弹性布局 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  position: relative;
  /* 为伪元素定位做准备 */

  .deleteChartlet {
    position: absolute;
    right: -10px;
    top: -10px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 100%;
    width: 20px;
    height: 20px;
    text-align: center;
    cursor: pointer;
    line-height: 20px;
    display: none;

    &:hover {
      background: #409EFF;
      color: #fff;
    }
  }

  &:hover .deleteChartlet {
    display: block !important;
  }
}

.defaultImg {
  width: 60px;
  height: 60px;
}
</style>