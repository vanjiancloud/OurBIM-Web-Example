<template>
    <div class="selfDialog">
          <el-form :style="{'width':'90%'}" :model="editForm" :rules="rulesEditForm" ref="editForm">
              <el-form-item label="名称:" label-width="100px" prop="name">
                <el-input v-model="editForm.name"></el-input>
              </el-form-item>
              <el-form-item label="贴图:" label-width="100px">
                <uploadComImg ref="uploadPhoto" @sonFile="sonFile"></uploadComImg>
              </el-form-item>
              <el-form-item label="分组:" label-width="100px" class="btnMore">
                <el-select v-model="editForm.selectVal" placeholder="请选择分组" ref="select">
                  <el-option
                    v-for="(item,index) in personalTexureGroup"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" :style="{'text-align':'center'}">
            <el-button @click="closeEditCom">取 消</el-button>
            <el-button type="primary" @click="editSubmit('editForm')">确 定</el-button>
          </div>
    </div>
</template>

<script>
    import uploadComImg from '../public/imgUp.vue'
    import { Getuserid } from "@/store/index.js";
    import axios from "@/utils/request";
    import axios2 from 'axios'
    export default {
      components: {
        uploadComImg
      },
      props:{
        personalTexureGroup:{
          type: Array,
          default: () => []
        }
      },
      data(){
        return {
          editForm:{
            name:'',
            selectVal:'', // 分组绑定值
          },
          rulesEditForm:{
            name:[{
                  required:true,
                  message:'请输入名称',
                  trigger:'blur'
                },{
                  required:true,
                  message:'请选择分组',
                  trigger:'blur'
                },
              ]
          },
          photoFile:'',
          baseURL: axios.defaults.baseURL,
        }
      },
      mounted(){
        this.editForm.selectVal = this.personalTexureGroup[0].value;
      },
      methods:{
        sonFile(e){
          this.photoFile = e;
        },
        // 上传贴图确定
        editSubmit(editForm){
          // console.log('确定',this.editForm);
            this.$refs[editForm].validate((valid) => {
              if(valid){
                let fd = new FormData();
                fd.append('fileUpload',this.photoFile);
                fd.append('userId', Getuserid());
                fd.append('textureName', this.editForm.name);
                fd.append('groupId', this.editForm.selectVal);  
                let config = {
                  headers: {
                  'Content-Type': 'multipart/form-data'
                  }
                }
                axios2.post(this.baseURL + '/material/uploadMaterialTextures', fd, config).then(res => {
                  if (res.data.code === 0) {
                    this.$emit('texureClose','success');
                    this.clearForm();
                    this.$message.success(res.data.message);
                  }else {
                    this.$emit('texureClose',false);
                    this.clearForm();
                    this.$message.error(res.data.message);
                  }
                }).catch(res => {
                    console.log(res)
                })
              }else{
                return false
              }
            });
        },
        // 关闭
        closeEditCom(){
            this.$emit('texureClose',false);
            this.clearForm();
        },
        // 清空表单
        clearForm(){
          this.editForm.name = '';
          this.photoFile='';
          this.$refs['editForm'].resetFields();
        }
      }
    }
</script>
<style lang="less" scoped>

</style>