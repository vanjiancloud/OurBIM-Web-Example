<!--
 * @Author: zk
 * @Date: 2021-04-27 13:47:02
 * @LastEditors: zk
 * @LastEditTime: 2021-05-17 14:17:05
 * @description: 标签树
-->
<template>
  <div class="tag-tree" v-if="isTag">
    <div class="tree-title">
      <!-- 关闭 -->
      <div class="close-part">
        <i class="el-icon-close" @click="closeTag(false)"></i>
      </div>
    </div>
    <!-- 操作 -->
    <div class="handle-part">
      <el-input
        class="search-tag"
        placeholder="请输入你要搜索的内容"
        @click.native.stop
        @change="changeTag"
        @keyup.enter.native="changeTag"
        v-model="modelTag"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <img src="../../assets/images/tag/1.png" @click="saveTag(0)" alt="" />
      <img src="../../assets/images/tag/2.png" @click="saveTag(1)" alt="" />
    </div>
    <!-- 标签树 -->
    <div class="tree-content" v-if="getProps">
      <el-tree
        ref="refTag"
        :data="DataTagTree"
        :props="propsTag"
        :expand-on-click-node="false"
        :highlight-current="true"
        :empty-text="treeEmpty"
        :filter-node-method="filterNode"
        node-key="id"
        :load="loadTag"
        lazy
      >
        <div
          class="tag-slot"
          :class="
            activeTree && node.data.id === activeTree.id && activeLeaf
              ? 'tree-select'
              : ''
          "
          slot-scope="{ node }"
        >
          <div class="upload-tag">
            <img :src="node.data.tagUrl" @click="editTagIcon(node)" alt="" />
          </div>
          <div class="label-tag" @click="handleTag(node)">{{ node.label }}</div>
          <div class="handle-tag">
            <img
              src="../../assets/images/tag/5.png"
              @click="editTag(node)"
              alt=""
            />
            <img
              v-if="node.data.isFolder === '0'"
              @click="locationTag(node)"
              src="../../assets/images/tag/7.png"
              alt=""
            />
            <img
              src="../../assets/images/tag/6.png"
              @click="removeTag(node)"
              alt=""
            />
          </div>
        </div>
      </el-tree>
    </div>
    <!-- 修改标签 -->
    <el-dialog
      :title="dialogPointData.title"
      :visible.sync="dialogEdit"
      :close-on-click-modal="false"
      append-to-body
      width="20%"
    >
      <el-form v-if="tagInfo" :model="tagInfo" :rules="rulesTag" ref="rulesTag">
        <el-form-item
          :label="dialogPointData.label"
          label-width="60px"
          prop="fileName"
        >
          <el-input @click.native.stop v-model="tagInfo.fileName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="dialogEdit = false"
          v-text="dialogPointData.cancel"
        ></el-button>
        <el-button
          type="primary"
          @click="updateTag"
          v-text="dialogPointData.confirm"
        ></el-button>
      </div>
    </el-dialog>
    <!-- 上传图片 -->
    <el-dialog
      :title="dialogPointData.title"
      :visible.sync="dialogIconEdit"
      :close-on-click-modal="false"
      append-to-body
      width="20%"
    >
      <div class="main-cropper">
        <div class="copy-cropper">
          <vueCropper
            ref="cropper"
            :img="cropperOption.img"
            :outputSize="cropperOption.size"
            :outputType="cropperOption.outputType"
            :info="false"
            :full="cropperOption.full"
            :canMove="cropperOption.canMove"
            :canMoveBox="cropperOption.canMoveBox"
            :fixedBox="cropperOption.fixedBox"
            :original="cropperOption.original"
            :autoCrop="cropperOption.autoCrop"
            :autoCropWidth="cropperOption.autoCropWidth"
            :autoCropHeight="cropperOption.autoCropHeight"
            :centerBox="cropperOption.centerBox"
            :high="cropperOption.high"
            :infoTrue="cropperOption.infoTrue"
            :enlarge="cropperOption.enlarge"
          ></vueCropper>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="dialogIconEdit = false"
          v-text="dialogPointData.cancel"
        ></el-button>
        <el-button
          type="primary"
          @click="updateTagIcon"
          v-text="dialogPointData.confirm"
        ></el-button>
      </div>
    </el-dialog>
    <el-upload
      v-if="tagIconInfo"
      class="upload-icon"
      ref="refUploadIcon"
      name="fileUpload"
      :data="{
        tagId: tagIconInfo.id,
      }"
      :action="uploadInfo.action"
      :show-file-list="false"
      :http-request="UploadImage"
      :auto-upload="false"
      :on-change="changeUpload"
    >
    </el-upload>
  </div>
</template>

<script>
import TAGTREE from "../../api/tag_tree";
import BASE from "../../utils/request";
import axios from "axios";

export default {
  props: {
    setProps: {
      type: Object,
      default: () => {},
    },
    taskId: {
      type: String,
      default: "",
    },
  },
  watch: {
    setProps: {
      handler() {
        if (this.setProps.taskId) {
          this.getProps = this.setProps;
          this.listTag().then((res) => {
            this.defaultTag = res[0];
          });
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      deep: true,
    },
  },
  data() {
    return {
      DataTagTree: [],
      uploadInfo: {
        action: BASE.defaults.baseURL + "/TagControl/postTagImg",
      },
      cropperOption: {
        img: null, // 裁剪图片的地址
        imgName: null,
        imgUrl: null,
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "png", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [7, 5], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      defaultTag: null,
      activeLeaf: false,
      activeTree: null,
      rulesTag: {
        fileName: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
      },
      dialogPointData: {
        title: "提示",
        label: "名称",
        confirm: "确认",
        cancel: "取消",
        successMessage: "修改成功！",
        saveMessage: "添加成功！",
      },
      dialogEdit: false,
      tagInfo: null,
      tagNode: null,
      tagIconInfo: null,
      tagIconNode: null,
      dialogIconEdit: false,
      isTag: true,
      modelTag: null,
      getProps: null,
      propsTag: {
        label: "fileName",
        isLeaf: (e) => {
          if (e.isFolder === "1") {
            return false;
          }
          if (e.isFolder === "0") {
            return true;
          }
        },
      },
      treeEmpty: this.$t("webClient.browser.tips[0]"),
    };
  },
  methods: {
    UploadImage(res) {
      /**
       * @Author: zk
       * @Date: 2021-05-08 16:54:31
       * @description: 自定义上传
       */
      let formData = new FormData();
      formData.append(
        "fileUpload",
        this.cropperOption.imgUrl,
        this.cropperOption.imgName
      );
      formData.append("tagId", this.tagIconInfo.id);
      formData.append("taskid", this.getProps.taskId);
      formData.append("lableVisibility", true);
      const config = {
        headers: {
          "Content-Type":
            "multipart/form-data;boundary=" + new Date().getTime(),
        },
      };
      axios
        .post(this.uploadInfo.action, formData, config)
        .then(() => {
          this.dialogIconEdit = false;
          this.reloadTree();
        })
        .catch(() => {
          this.$message.error("上传失败");
        });
    },
    getBase64(file) {
      /**
       * @Author: zk
       * @Date: 2021-05-08 16:55:32
       * @description: 文件转换
       */
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },
    getBlob(dataurl) {
      /**
       * @Author: zk
       * @Date: 2021-05-08 17:12:17
       * @description: base64转blob
       */
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    async getFile(theBlob, fileName) {
      /**
       * @Author: zk
       * @Date: 2021-05-08 17:09:19
       * @description: 转换file
       */
      theBlob.lastModifiedDate = await new Date();
      theBlob.name = fileName;
      return theBlob;
    },
    changeUpload(file) {
      /**
       * @Author: zk
       * @Date: 2021-05-08 15:54:26
       * @description: 文件上传之前
       */
      const fileType = file.raw.type;
      if (
        fileType !== "image/jpeg" &&
        fileType !== "image/png" &&
        fileType !== "image/jpg"
      ) {
        this.$message({
          type: "warning",
          message: "请上传图片",
        });
      } else {
        this.cropperOption.imgName = file.name;
        this.getBase64(file.raw).then((res) => {
          this.cropperOption.img = res;
          this.$emit("setListenClick", false);
          this.dialogIconEdit = true;
        });
      }
    },
    editTagIcon(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-08 13:54:10
       * @description: 上传图片弹窗
       */
      this.tagIconInfo = JSON.parse(JSON.stringify(e.data));
      this.tagIconNode = e;
      this.$nextTick(() => {
        this.$refs.refUploadIcon.$children[0].$refs.input.click();
      });
    },
    handleTag(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-07 17:05:24
       * @description: 操作标签栏
       */
      if (this.activeTree) {
        if (this.activeTree.id === e.data.id) {
          this.activeLeaf = this.activeLeaf ? false : true;
        } else {
          this.activeLeaf = true;
        }
      } else {
        this.activeLeaf = true;
      }
      this.activeTree = e.data;
      this.$emit("setTagClick", {
        state: this.activeLeaf,
        tagId: this.activeLeaf ? this.activeTree.id : null,
      });
    },
    editTag(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-07 10:18:25
       * @description: 修改标签弹窗
       */
      this.$emit("setListenClick", false);
      this.tagInfo = JSON.parse(JSON.stringify(e.data));
      this.tagNode = e;
      this.dialogEdit = true;
    },
    updateTagIcon() {
      /**
       * @Author: zk
       * @Date: 2021-05-08 15:06:25
       * @description: 上传icon
       */
      this.$refs.cropper.getCropData((data) => {
        this.getBlob(data);
        this.getFile(this.getBlob(data), this.cropperOption.imgName).then(
          (res) => {
            this.cropperOption.imgUrl = res;
            this.$refs.refUploadIcon.submit();
          }
        );
      });
    },
    updateTag() {
      /**
       * @Author: zk
       * @Date: 2021-05-07 10:18:25
       * @description: 更新标签
       */      
      this.$refs["rulesTag"].validate((valid) => {
          if (valid) {
            let params = {
              taskid: this.getProps.taskId,
              tagId: this.tagInfo.id,
              tagName: this.tagInfo.fileName,
              lableVisibility: true,
            };
            TAGTREE.UPDATETAG(params)
              .then(() => {
                this.dialogEdit = false;
                this.tagNode.data.fileName = this.tagInfo.fileName;
                this.$refs.refTag.updateKeyChildren(this.tagNode.key, this.tagNode);
                this.$emit("setListenClick", true);
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            return false;
          }
        });
    },
    locationTag(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-07 10:18:09
       * @description: 定位标签
       */
      let params = {
        taskid: this.getProps.taskId,
        tagId: e.key,
      };
      TAGTREE.UPDATAFOCUSTAG(params)
        .then(() => {
          this.$message({
            message: this.$t("webClient.loadBox.message[2]"),
            type: "success",
          });
        })
        .catch(() => {
          this.$message({
            message: this.$t("webClient.loadBox.message[3]"),
            type: "error",
          });
        });
    },
    removeTag(node) {
      /**
       * @Author: zk
       * @Date: 2021-05-07 09:22:44
       * @description: 删除标签
       */
      this.$emit("setListenClick", false);
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {          
          this.activeLeaf = false
          this.activeTree = null
          this.$emit("setListenClick", true);
          let params = {
            taskid: this.getProps.taskId,
            tagId: node.key,
          };
          TAGTREE.REMOVERTAG(params)
            .then(() => {
              this.listTag().then((listRes) => {
                if (listRes && listRes.length > 0) {
                  this.defaultTag = listRes[0];
                } else {
                  this.treeEmpty = this.$t("webClient.browser.tips[1]");
                  this.defaultTag = null;
                }
              });
              this.$refs.refTag.remove(node);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$emit("setListenClick", true);
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    saveTag(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-06 18:07:38
       * @description: 新增 0 标签 1 标签集
       */
      // 判断是否可以新增
      if (this.activeLeaf && this.activeTree.isFolder === "0") {
        this.$message({
          type: "warning",
          message: "请先选择标签组",
        });
        return;
      }

      let params = {
        taskid: this.getProps.taskId,
      };
      this.activeLeaf ? (params.tagId = this.activeTree.id) : "";

      if (e === 0) {
        TAGTREE.SAVETAG(params)
          .then(() => {
            this.listTag().then((res) => {
              this.realTreeList = res;
              this.reloadTree();
            });
          })
          .catch((err) => {});
      } else {
        TAGTREE.SAVETAGGATHER(params)
          .then(() => {
            this.listTag().then((res) => {
              this.realTreeList = res;
              this.reloadTree();
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    reloadTree() {
      if (this.defaultTag) {
        this.$refs.refTag.getNode(
          this.activeLeaf ? this.activeTree.id : this.defaultTag.id
        ).parent.loaded = false;
        this.$refs.refTag
          .getNode(this.activeLeaf ? this.activeTree.id : this.defaultTag.id)
          .parent.expand();
      } else {
        this.DataTagTree = this.realTreeList;
      }
    },
    async listTag(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-06 16:33:20
       * @description: 获取标签树
       */
      let params = {
        taskid: this.getProps.taskId,
      };
      e ? (params.tagId = e) : "";
      let realTag = await TAGTREE.LISTTAG(params)
        .then((res) => {
          if (res.data.code === 0) {
            return res.data.data;
          } else {
            return [];
          }
        })
        .catch((err) => {
          return [];
        });
      return realTag;
    },
    loadTag(node, resolve) {
      /**
       * @Author: zk
       * @Date: 2021-05-06 13:12:53
       * @description: 加载数据
       */
      if (node.level === 0) {
        this.listTag(node.key).then((res) => {
          if (res.length > 0) {
            this.defaultTag = res[0];
            return resolve(res);
          } else {
            this.treeEmpty = this.$t("webClient.browser.tips[1]");
          }
        });
      }
      if (node.level >= 1) {
        this.listTag(node.key).then((res) => {
          if (res.length > 0) {
            return resolve(res);
          } else {
            this.treeEmpty = this.$t("webClient.browser.tips[1]");
            return resolve([]);
          }
        });
      }
    },
    changeTag() {
      /**
       * @Author: zk
       * @Date: 2021-05-06 11:40:59
       * @description: 搜索
       */
      this.$refs.refTag.filter(this.modelTag);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.fileName.indexOf(value) !== -1;
    },
    closePart(e) {
      /**
       * @Author: zk
       * @Date: 2021-04-27 13:59:02
       * @description: 全局控制显示隐藏
       */
      this.isTag = e;
    },
    closeTag(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-06 10:12:15
       * @description: 控制显示隐藏
       */
      this.closePart(e);
      this.$emit("closeTag", e);
    },
  },
};
</script>

<style lang="less" scoped>
.tag-tree {
  position: absolute;
  z-index: 9;
  height: 50vh;
  top: 0;
  width: 400px;
  margin: 2vh 0 0 20px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
  .tree-title {
    display: flex;
    padding: 20px 15px 0 15px;
    color: #ffffff;
    .close-part {
      margin-left: auto;
      cursor: pointer;
    }
  }
  // 操作
  .handle-part {
    display: flex;
    align-items: center;
    padding: 10px;

    img {
      margin-left: 10px;
      width: 20px;
      height: 20px;
    }
  }
  .tree-content {
    margin: 0 auto;
    height: ~"calc(100% - 110px)";
    width: ~"calc(100% - 20px)";
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 6px;
      /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }

    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.3);
    }

    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.295);
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 8px;
      .label-span {
        padding-left: 5px;
      }
    }
    .tag-slot {
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;
      .upload-tag {
        margin-right: 10px;
        display: flex;
        align-items: center;
        img {
          width: 20px;
          height: 20px;
        }
      }
      .label-tag {
        width: ~"calc(100% - 120px)";
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .handle-tag {
        width: 90px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        position: absolute;
        right: 0;
        img {
          margin-left: 10px;
        }
      }
    }
  }
  .upload-icon {
    position: absolute;
    z-index: -1;
  }
}
.main-cropper {
  width: 100%;
  .copy-cropper {
    margin: 0 auto;
    width: 200px;
    height: 200px;
  }
}
</style>
<style lang="less">
.search-tag {
  .el-input__inner {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
}
.tree-select {
  background: rgba(255, 255, 255, 0.2);
}
</style>