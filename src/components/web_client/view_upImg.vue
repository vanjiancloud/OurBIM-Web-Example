<template>
    <div class="selfDialog">
          <el-form :style="{'width':'90%'}" :model="editForm" :rules="rulesEditForm" ref="editForm" label-width="60px">
              <el-form-item label="名称:" prop="name">
                <el-input v-model="editForm.name" @keydown.native.stop></el-input>
              </el-form-item>
              <el-form-item label="贴图:" prop="photoFile">
                <Upload v-model="editForm.photoFile" accept="image/png" :autoUpload="false"/>
              </el-form-item>
              <el-form-item label="分组:" class="btnMore" prop="selectVal">
                <div style="display: flex;">
                <el-select v-model="editForm.selectVal" placeholder="请选择分组" ref="select">
                  <el-option
                    v-for="(item,index) in personalTexureGroup"
                    :key="index"
                    :label="item.groupName"
                    :value="item.groupId">
                  </el-option>
                </el-select>
                <el-button size="small" type="primary" @click="addGroup()">新增分组</el-button>
            </div>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" :style="{'text-align':'center'}">
            <el-button @click="closeEditCom">取 消</el-button>
            <el-button type="primary" @click="editSubmit('editForm')">确 定</el-button>
          </div>
          <DialogChartletGroup ref="DialogChartletGroup" @success="successGroup"/>
    </div>
</template>

<script>
import Upload from '@/components/Upload/singleUpload.vue'
import DialogChartletGroup from './DialogChartletGroup.vue'
    import { Getuserid } from "@/store/index.js";
    import axios from "@/utils/request";
    import axios2 from 'axios'
    export default {
      components: {
        Upload,
        DialogChartletGroup
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
            photoFile:null,
          },
          rulesEditForm:{
            name:[{
                  required:true,
                  message:'请输入名称',
                  trigger:'blur'
                },
              ],
            photoFile:{required:true,message:'请上传贴图',trigger:'blur'},
            selectVal:{required:true,message:'请选择分组',trigger:'blur'}
          },
          baseURL: axios.defaults.baseURL,
        }
      },
      mounted(){
        this.editForm.selectVal = this.personalTexureGroup[0].value;
      },
      methods:{
        // 上传贴图确定
        editSubmit(editForm){
          // console.log('确定',this.editForm);
            this.$refs[editForm].validate((valid) => {
              if(valid){
                let fd = new FormData();
                fd.append('fileUpload',this.editForm.photoFile);
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
                    this.$refs.uploadPhoto.delFile();
                  }else {
                    // this.$emit('texureClose',false);
                    // this.clearForm();
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
          this.photoFile = null
          this.$refs['editForm'].resetFields();
        },
        addGroup(){
            this.$refs.DialogChartletGroup.show()
        },
        successGroup(){
            this.$parent.$parent.getPersonPhoto();
        }
      }
    }
</script>
<style lang="less" scoped>

</style>