<!-- 上传贴图 -->
<template>
  <el-dialog
    title=""
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    width="30%"
    :before-close="close">
    <el-form :style="{'width':'90%'}" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="分组名称:" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="缩略图:">
          <ImgUp ref="ImgUp" @sonFile="sonFile"></ImgUp>
        </el-form-item>
        <!-- <el-form-item label="分组:" class="btnMore">
          <el-select v-model="form.selectVal" placeholder="请选择分组" ref="select">
            <el-option
              v-for="(item,index) in personalTexureGroup"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ImgUp from '@/components//public/imgUp.vue'
import CHAILIAOAPI from "@/api/material_api";
export default {
  components: { ImgUp },
  props: {
    userId:{
      type: [String,Number],
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {},
      rules:{
        name:[{required:true,message:'请输入名称',trigger:'blur'}]
      }
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    show(){
      this.dialogVisible = true
    },
    close(){
      this.dialogVisible = false
    },
    sonFile(e){
      // this.photoFile = e;
      console.log('🚀🚀🚀',e);  
    },
    // 创建个人库贴图分组
    createTextureGroup(){
      const {userId} = this.$route.query;
      let params = {
        userId:userId,
        groupName:'我的分组'
      }
      CHAILIAOAPI.CREATEMATERIALTEXTUREGROUP(params).then(res=>{
        if(res.data.code === 1){
          this.getPersonPhoto();
        }
      }).catch(()=>{})
    },
    // 获取 个人库 贴图
    getPersonPhoto(str){
      const {userId} = this.$route.query;
      CHAILIAOAPI.GETMATERIALALLTEXTUREINFO({userId:userId}).then((res)=>{
          if(res.data.code === 0){
            this.personalPicMaterInfo = res.data.data || [];
            if(str === 'groupOrNot' && this.personalPicMaterInfo.length<=0){
              this.createTextureGroup(); // 新用户没有分组 默认创建一个分组
            }
            if(this.personalTexureGroup.length<=0){
              res.data.data.forEach(item=>{
                let obj = {};
                obj.value = item.groupId;
                obj.label = item.groupName;
                this.personalTexureGroup.push(obj);
              })
            }
          }
      }).catch(()=>{})
    },
    submit(){
      this.close()
    }
  }
};
</script>
<style lang="scss" scoped>
</style>