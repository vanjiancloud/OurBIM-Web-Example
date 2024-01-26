<!-- 新建/编辑标签 -->
<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="600px" :before-close="hide">
        <el-form ref="form" :style="{'width':'90%'}" :model="form" :rules="rules" label-width="135px">
            <el-form-item label="标签样板名称:" prop="name">
                <el-input v-model="form.name" @keydown.native.stop></el-input>
            </el-form-item>
            <el-form-item label="标签样板分组:" prop="parentId">
                <el-select v-model="form.parentId" placeholder="请选择分组" style="width:100%">
                    <el-option v-for="(item,index) in groupList" :key="index" :label="item.name" :value="item.tagId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="缩略图:">
                <SingleUpload v-model="form.tagUrl" url="/tagControl/uploadTagImg" accept="image/png" @success="uploadSuccess"></SingleUpload>
            </el-form-item>
            <el-form-item label="标签样板类型:" prop="type">
                <el-select v-model="form.type" placeholder="请选择" style="width:100%">
                    <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="!['customize','customizeInWorld'].includes(form.type)" :label="['webui','webui3d'].includes(form.type)?'WebUI面板尺寸:':'图标尺寸:'">
                <span class="TagTitle">宽</span>
                <el-input v-model="form.iconSize.width" v-only-number="{min:0}" @keydown.native.stop placeholder="宽度(px)" style="width: 30%;;margin-left: 8px;"></el-input>
                <span class="unit">px</span>
                <span class="unit">高</span>
                <el-input v-model="form.iconSize.height" v-only-number="{min:0}" @keydown.native.stop placeholder="高度(px)" style="width: 30%;margin-left: 8px;"></el-input>
                <span class="unit">px</span>
            </el-form-item>
            <template v-if="['anchorCustomize','customize','customizeInWorld'].includes(form.type)">
                <el-form-item prop="iconPath" label="数据面板背景图片">
                    <SingleUpload v-model="form.iconPath" url="/tagControl/uploadTagImg" accept="image/png" @success="uploadSuccessBg"></SingleUpload>
                </el-form-item>
                <el-form-item label="数据面板尺寸">
                    <span class="TagTitle">宽</span>
                    <el-input v-model="form.labelSize.width" v-only-number="{min:0}" @keydown.native.stop placeholder="宽度(px)" style="width: 30%;;margin-left: 8px;"></el-input>
                    <span class="unit">px</span>
                    <span class="unit">高</span>
                    <el-input v-model="form.labelSize.height" v-only-number="{min:0}" @keydown.native.stop placeholder="高度(px)" style="width: 30%;margin-left: 8px;"></el-input>
                    <span class="unit">px</span>
                </el-form-item>
                <el-form-item prop="slotNum" label="数据面板表格">
                    <span class="TagTitle">行数</span>
                    <el-input @change="changeTableSize" v-model="form.slotNum.row" v-only-number="{max:100,min:0,precision:0}" @keydown.native.stop placeholder="行数" style="width: 30%;;margin-left: 8px;"></el-input>
                    <span class="unit">行</span>
                    <span class="unit">列数</span>
                    <el-input @change="changeTableSize" v-model="form.slotNum.column" v-only-number="{max:100,min:0,precision:0}" @keydown.native.stop placeholder="列数" style="width: 30%;margin-left: 8px;"></el-input>
                    <span class="unit">列</span>
                </el-form-item>
                <div class="TagTitle">数据表信息</div>
                <el-table class="table" :data="form.tableStyle" size="mini" :show-header="false" :span-method="objectSpanMethods">
                    <el-table-column align="center" v-for="(item, index) in form.slotNum.column" :key="index">
                        <template slot-scope="scope">
                            <el-input :class="{focusInput:focusInput.rowIndex===scope.$index&&focusInput.colIndex===index}" 
                            @focus="focusTableItem(scope.row.slotList,{ rowIndex: scope.$index, colIndex: index })" v-model="scope.row[`text${index+1}`]"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
                <template v-if="focusInput.rowIndex > -1">
                    <div class="TagTitle" style="margin-top: 20px;">单元格信息</div>
                    <el-form-item label="单元格尺寸">
                        <span class="TagTitle">长</span>
                        <el-input v-model="styleForm.size.width" v-only-number="{min:0}" @keydown.native.stop placeholder="宽度(px)" style="width: 30%;;margin-left: 8px;"></el-input>
                        <span class="unit">px</span>
                        <span class="unit">宽</span>
                        <el-input v-model="styleForm.size.height" v-only-number="{min:0}" @keydown.native.stop placeholder="高度(px)" style="width: 30%;margin-left: 8px;"></el-input>
                        <span class="unit">px</span>
                    </el-form-item>
                    <el-form-item label="字体">
                        <el-select v-model="styleForm.fontTypeface" placeholder="请选择" style="width:100%">
                            <el-option v-for="(item,index) in fontType" :key="index" :label="item.name" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="字体大小">
                        <el-input v-model="styleForm.fontSize" @keydown.native.stop v-only-number="{min:10,precision:0}"></el-input>
                    </el-form-item>
                    <el-form-item label="文字颜色" class="colorBox">
                        <div class="colorContent">
                            <el-color-picker v-model="styleForm.fontColor" show-alpha></el-color-picker>
                            <span>{{ styleForm.fontColor }}</span>
                        </div>
                    </el-form-item>
                    <div class="TagTitle">文字内边距</div>
                    <el-form-item label-width="0" class="margin">
                        <span class="marginTitle">左</span>
                        <el-input class="marginInput" v-model="styleForm.margin[0]" v-only-number="{min:0,precision:0}" @keydown.native.stop placeholder="左"></el-input>
                        <span class="marginTitle">px</span>
                        <span class="marginTitle">上</span>
                        <el-input class="marginInput" v-model="styleForm.margin[1]" v-only-number="{min:0,precision:0}" @keydown.native.stop placeholder="上"></el-input>
                        <span class="marginTitle">px</span>
                        <span class="marginTitle">右</span>
                        <el-input class="marginInput" v-model="styleForm.margin[2]" v-only-number="{min:0,precision:0}" @keydown.native.stop placeholder="右"></el-input>
                        <span class="marginTitle">px</span>
                        <span class="marginTitle">下</span>
                        <el-input class="marginInput" v-model="styleForm.margin[3]" v-only-number="{min:0,precision:0}" @keydown.native.stop placeholder="下"></el-input>
                        <span class="marginTitle">px</span>
                    </el-form-item>
                    <div class="TagTitle">文字外边距</div>
                    <el-form-item label-width="0" class="margin">
                        <span class="marginTitle">左</span>
                        <el-input class="marginInput" v-model="styleForm.padding[0]" v-only-number="{min:0,precision:0}" @keydown.native.stop placeholder="左"></el-input>
                        <span class="marginTitle">px</span>
                        <span class="marginTitle">上</span>
                        <el-input class="marginInput" v-model="styleForm.padding[1]" v-only-number="{min:0,precision:0}" @keydown.native.stop placeholder="上"></el-input>
                        <span class="marginTitle">px</span>
                        <span class="marginTitle">右</span>
                        <el-input class="marginInput" v-model="styleForm.padding[2]" v-only-number="{min:0,precision:0}" @keydown.native.stop placeholder="右"></el-input>
                        <span class="marginTitle">px</span>
                        <span class="marginTitle">下</span>
                        <el-input class="marginInput" v-model="styleForm.padding[3]" v-only-number="{min:0,precision:0}" @keydown.native.stop placeholder="下"></el-input>
                        <span class="marginTitle">px</span>
                    </el-form-item>
                    <el-form-item label="对齐方式">
                        <div class="aligning">
                            <span @click="styleForm.horAlign = item.key" :class="{activeAlign:styleForm.horAlign===item.key}" v-for="(item,index) in horAlignList" :key="index">
                                <svg-icon :icon-class="item.name" class="svgBtn"/>
                            </span>
                        </div>
                    </el-form-item>
                    <el-form-item label="垂直对齐">
                        <div class="aligning">
                            <span @click="styleForm.verAlign = item.key" :class="{activeAlign:styleForm.verAlign===item.key}" v-for="(item,index) in vertAlignList" :key="index">
                                <svg-icon :icon-class="item.name" class="svgBtn"/>
                            </span>
                        </div>
                    </el-form-item>
                </template>
            </template>
            <template v-if="['webui','webui3d'].includes(form.type)">
                <el-form-item label="URL地址">
                    <el-input v-model="form.tagInfo.url" @keydown.native.stop></el-input>
                </el-form-item>
                <el-form-item label="面板颜色" class="colorBox">
                    <div class="colorContent">
                        <el-color-picker v-model="form.tagInfo.color" show-alpha></el-color-picker>
                        <span>{{ form.tagInfo.color }}</span>
                    </div>
                </el-form-item>
            </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide()">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import SingleUpload from "@/components/Upload/singleUpload.vue"
import { addUserTag, editUserTag, addTagStyle, updateTagStyle } from '@/api/resource/tag.js'
import { typeList, fontType, horAlignList, vertAlignList, TagtypeList } from './json'
export default {
    components: { SingleUpload },
    props: {
        groupList: {
            type: Array,
            default:()=>{
                return []
            }
        },
        data: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            typeList,
            fontType,
            horAlignList,
            vertAlignList,
            title:'',
            dialogVisible: false,
            form: {
                type: 'default',
                labelSize: {
                    width: 400,
                    height: 210
                },
                iconSize: {
                    width: 120,
                    height: 110
                },
                slotNum: {
                    row:4,
                    column:3,
                },
                tableStyle: [],
                tagInfo: {}
            },
            // 样式表单
            styleForm: {
                size: {
                    width: 120,
                    height: 48
                },
                fontTypeface: 'simsun',
                fontSize: 10,
                fontColor: '#ADE3F3',
                margin: [0,0,0,0],
                padding: [45,12,0,0],
                horAlign: 'left',
                verAlign: 'left'
            },
            rules: {
                name: [{ required: true, message: "请输入名称", trigger: "blur" }],
                type: [{ required: true, message: "请选择样板类型", trigger: "blur" }],
                parentId: [{ required: true, message: "请选择样板分组", trigger: "blur" }],
                iconPath: [{ required: true, message: "请上传数据面板背景图片", trigger: "blur" }],
                slotNum: [{ required: true, message: "请输入数据面板表格行或列数", trigger: "blur" }],
            },
            focusInput: {},//选中的表格表单
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        show(title, row) {
            this.title = title
            this.form = this.$options.data().form
            this.styleForm = this.$options.data().styleForm
            this.dialogVisible = true;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
                if(row.tagId){
                    this.form = { ...this.$options.data().form, ...row }
                    if(row.tagStyle){
                        this.$set(this.form, 'iconPath', row.tagStyle.iconPath)
                        this.$set(this.form, 'labelSize', { width:row.tagStyle.labelSize.split('*')[0], height:row.tagStyle.labelSize.split('*')[1] })
                        this.$set(this.form, 'slotNum', { row:row.tagStyle.slotNum.split('*')[0], column:row.tagStyle.slotNum.split('*')[1] })
                    }
                    if(row.tagInfo){
                        if(row.tagInfo.iconSize){
                            this.$set(this.form, 'iconSize', { width:row.tagInfo.iconSize.split('*')[0], height:row.tagInfo.iconSize.split('*')[1] })
                        }
                    }
                }
                if(row.parentId){
                    this.$set(this.form, 'parentId', row.parentId)
                }
                this.changeTableSize()
            })
        },
        hide() {
            this.dialogVisible = false;
        },
        uploadSuccess(e){
            this.$set(this.form, 'tagUrl', `${e ? this.$config.VUE_APP_REQUEST_URL+'/tag/'+e:''}`)
        },
        uploadSuccessBg(e){
            this.$set(this.form, 'iconPath', `${e ? this.$config.VUE_APP_REQUEST_URL+'/tag/'+e:''}`)
        },
        // 合并列
        objectSpanMethods({ row, column, rowIndex, columnIndex }){
            if (rowIndex === 0) {
                return { rowspan: 1, colspan: this.form.slotNum.column };
            }
        },
        // 数字转大写字母
        numberToLLetter (n){
            if (parseInt(n) < 0) return
            let str = "";
            let m = n % 26;
            m = m === 0 ? 26 : m;
            str = String.fromCharCode(64 + parseInt(m))
            return str;
		},
        // 数据面板表格
        changeTableSize(){
            this.focusInput = {}
            this.form.slotNum.column = Math.round(+this.form.slotNum.column)
            this.form.slotNum.row = Math.round(+this.form.slotNum.row)
            let arr = [],obj = {},slotList = [];
            let arrIndex = 0;
            // 表头和内容数组拼接起来回显
            let newSlotList = this.form.tagStyle && (new Array(this.form.slotNum.column).fill(this.form.tagStyle.title)).concat(this.form.tagStyle.slotList)
            for (let i = 0; i < this.form.slotNum.row+1; i++) {    
                slotList = []
                for (let index = 0; index < this.form.slotNum.column; index++) {
                    this.$set(obj, 'text' + (index+1), this.form.tableStyle[i]?.[`text${index+1}`] || ((i===0&&index===0) ? 'Title' : this.numberToLLetter(index+1)+i))
                    let hasList = newSlotList?.[arrIndex]
                    if(this.form.tagId && hasList){
                        slotList.push({
                            ...hasList,
                            margin: hasList?.margin.split(','),
                            padding: hasList?.padding.split(','), 
                            size: { width: hasList?.size.split('*')[0], height:hasList?.size.split('*')[1]}
                        })
                    }else{
                        slotList.push(this.form.tableStyle[i]?.slotList[index] || this.$options.data().styleForm)
                    }
                    arrIndex++;
                }
                arr.push({ ...JSON.parse(JSON.stringify(obj)), slotList })
            }
            this.form.tableStyle = arr
        },
        // 点击表格编辑样式
        focusTableItem(arr, { rowIndex, colIndex }){
            this.focusInput = { rowIndex, colIndex }
            this.styleForm = arr[colIndex]&&Object.keys(arr[colIndex]) ? arr[colIndex] : this.$options.data().styleForm
            this.form.tableStyle[rowIndex].slotList[colIndex] = this.styleForm
        },
        addApi(data){
            addUserTag(data).then(() => {
                this.$message.success('添加成功！')
                this.hide();
                this.$parent.$parent.getTagList(this.form.parentId);
            });
        },
        editApi(data){
            editUserTag(data).then(() => {
                this.$message.success('修改成功！')
                this.hide();
                this.$parent.$parent.getTagList(this.form.parentId);
            });
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false;
                let slotList = []
                this.form.tableStyle.forEach(e=>{
                    let newList = e.slotList.map(e=>{
                        return{
                            ...e,
                            margin:e.margin.join(','),
                            padding:e.padding.join(','),
                            size:(e.size.width || '')+ '*' + (e.size.height || '')
                        }
                    })
                    slotList = slotList.concat(newList)
                })

                let styleData = {
                    iconPath: this.form.iconPath && this.form.iconPath.substring(this.form.iconPath.lastIndexOf("\/") + 1,this.form.iconPath.length),
                    labelSize: (this.form.labelSize.width || '') + '*' + (this.form.labelSize.height || ''),
                    slotNum: (this.form.slotNum.row || '') + '*' + (this.form.slotNum.column || ''),
                    title: slotList[0],
                    slotList:slotList.slice(+this.form.slotNum.column)
                }

                let newUrl = this.form.tagUrl && this.form.tagUrl.substring(this.form.tagUrl.lastIndexOf("\/") + 1,this.form.tagUrl.length)
                let { type, name, parentId, tagId, tagInfo, iconSize } = this.form
                let data = {
                    type, name, parentId, tagId,
                    tagUrl: newUrl,
                    tagInfo:{
                        ...tagInfo,
                        iconSize: (iconSize.width || '') + '*' + (iconSize.height || '')
                    }
                };
                if(this.form.tagId){
                    if(['anchorCustomize','customize','customizeInWorld'].includes(this.form.type)){
                        updateTagStyle({taskId:this.data.taskId,tagStyleId:this.form.tagInfo.tagStyleId},styleData).then(()=>{
                            this.editApi(data)
                        })
                    }else{
                        this.editApi(data)
                    }
                }else{
                    if(['anchorCustomize','customize','customizeInWorld'].includes(this.form.type)){
                        addTagStyle({taskId:this.data.taskId},styleData).then(res=>{
                            this.addApi({ ...data, tagInfo: { ...data.tagInfo, tagStyleId:res.data } })
                        })
                    } else{
                        this.addApi(data)
                    }
                }
            })
        },
    },
};
</script>
<style lang="less" scoped>
.unit{
    margin-left: 6px;
}
.TagTitle{
    margin: 0 10px 16px 10px;
}
.colorBox{
    /deep/.el-form-item__content{
        line-height: 30px;
    }
}
.focusInput{
    border: 2px solid #3e9af8;
    border-radius: 5px;
}
.margin{
    .marginTitle{
        margin: 0 6px;
    }
    .marginInput{
        width: 14%;
    }
}
.colorContent{
    border-radius: 2px;
    border: 1px solid #727272;
    padding: 3px;
    display: flex;
    span{
        padding: 0 3px;
        font-size: 12px;
    }
    /deep/ .el-color-picker{
        height: 29px;
        .el-color-picker__trigger{
            border:none;
            width: 55px;
            height: 29px;
            padding: 0;
            border-radius: 4px;
            overflow: hidden;
            .el-color-picker__color{
                border:none;
            }
        }
    }
}
.aligning{
    >span{
        position: relative;
        padding: 0px 8px;
        cursor: pointer;
        &::before{
            content: '';
            position: absolute;
            left: 0;
            top: -2px;
            width: 2px;
            height: 14px;
            background: #979797;
        }
        &:first-child::before{
            width: 0px;
        }
    }
    .svgBtn{
        color: #3b3333;
        font-size: 30px;
        padding: 5px;
    }
    .activeAlign{
        .svgBtn{
            border-radius: 2px;
            background: #24262B;
            color: #ffffff;
        }
    }
}
</style>