<template>
    <div class="boxbox">
        <el-upload
            class="avatar-uploader"
            :action="baseURL + '/comControl/updateUserCom'"
            name="fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-change="changeFile"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
import axios from "@/utils/request";
export default {
    data() {
      return {
        imageUrl: '',
        baseURL: axios.defaults.baseURL,
        uploadFiles:''  // formData 文件
      };
    },
    methods: {
      changeFile(file, fileList) {
			this.uploadFiles = fileList[0].raw 
            this.$emit('fromSonFile',this.uploadFiles)
	  },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        console.log('beforeUpload', file)
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg');
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG/PNG/JPEG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
}
</script>

<style lang="less" scoped>
    // .box{
    //     border: 1px solid red;  
    // }
 .avatar-uploader .el-upload {
    border: 1px dashed #852727;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #dcdfe6;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 108px;
    height: 78px;
    line-height: 78px;
    text-align: center;
  }
  .avatar {
    width: 108px;
    height: 78px;
    display: block;
  }
  ::v-deep .el-upload{
    border: 1px solid #dcdfe6;
  }
</style>