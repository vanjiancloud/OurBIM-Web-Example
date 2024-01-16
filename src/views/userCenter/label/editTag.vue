<template>
    <el-form class="editTag" ref="form" :model="form" label-width="80px" v-if="data.clickTagData">
        <div class="tagBigTitle">标签信息</div>
        <el-form-item label="标签名称">
            <el-input v-model="form.labelName" @keydown.native.stop @change="editAndReList()"></el-input>
        </el-form-item>
        <el-form-item label="标签样式" prop="type">
            <el-cascader popper-class="styleCascader" v-model="form.changeType" :options="newTagtypeList" :props="{ expandTrigger: 'hover', label: 'name', value:'key' }" @change="changeType"></el-cascader>
        </el-form-item>
        <el-form-item prop="type" label-width="0">
            <div class="coordinate">            
                <div class="TagTitle" style="margin: -15px 10px 0 10px;">坐标：</div>
                <div class="coordinateItemInput">
                    X<el-input-number v-model="form.location.x" controls-position="right" size="mini"
                        @keydown.native.stop @change="edit()" />
                    Y<el-input-number v-model="form.location.y" controls-position="right" size="mini"
                        @keydown.native.stop @change="edit()" />
                    Z<el-input-number v-model="form.location.z" controls-position="right" size="mini"
                        @keydown.native.stop @change="edit()" />
                    <i class="el-icon-refresh-right"></i>
                </div>
                <template v-if="form.type==='customizeInWorld'">
                    <div class="TagTitle" style="margin: -15px 10px 0 10px;">角度：</div>
                    <div class="coordinateItemInput">
                        P<el-input-number v-model="form.rotation.p" controls-position="right" size="mini"
                            @keydown.native.stop @change="edit()" />
                        Y<el-input-number v-model="form.rotation.y" controls-position="right" size="mini"
                            @keydown.native.stop @change="edit()" />
                        R<el-input-number v-model="form.rotation.r" controls-position="right" size="mini"
                            @keydown.native.stop @change="edit()" />
                        <i class="el-icon-refresh-right"></i>
                    </div>
                    <div class="TagTitle" style="margin: -15px 10px 0 10px;">比例：</div>
                    <div class="coordinateItemInput">
                        X<el-input-number v-model="form.scale.x" controls-position="right" size="mini"
                            @keydown.native.stop @change="edit()" />
                        Y<el-input-number v-model="form.scale.y" controls-position="right" size="mini"
                            @keydown.native.stop @change="edit()" />
                        Z<el-input-number v-model="form.scale.z" controls-position="right" size="mini"
                            @keydown.native.stop @change="edit()" />
                        <i class="el-icon-refresh-right"></i>
                    </div>
                </template>
            </div>
        </el-form-item>
        <!-- 普通标签 -->
        <template v-if="form.type==='default'">
            <el-form-item label="标签图标">
                <SingleUpload v-model="form.tagUrl" url="/tagControl/uploadTagImg" accept="image/png" @success="uploadSuccess"></SingleUpload>
            </el-form-item>
            <el-form-item label-width="0">
                <div class="TagTitle">图标尺寸</div>
                <span class="unit">宽</span>
                <el-input v-model="form.iconSize.width" @keydown.native.stop placeholder="宽度(px)" style="width: 30%;;margin-left: 8px;" @change="edit()"></el-input>
                <span class="unit">px</span>
                <span class="unit">高</span>
                <el-input v-model="form.iconSize.height" @keydown.native.stop placeholder="高度(px)" style="width: 30%;margin-left: 8px;" @change="edit()"></el-input>
                <span class="unit">px</span>
            </el-form-item>
            <el-form-item label="背景颜色" class="colorBox">
                <div class="colorContent">
                    <el-color-picker @change="edit" v-model="form.color" show-alpha></el-color-picker>
                    <span>{{ form.color }}</span>
                </div>
            </el-form-item>
        </template>
        <!-- 普通锚点标签 -->
        <template v-else-if="form.type==='anchor'">
            <el-form-item label="锚点图标">
                <SingleUpload v-model="form.tagUrl" url="/tagControl/uploadTagImg" accept="image/png" @success="uploadSuccess"></SingleUpload>
            </el-form-item>
            <el-form-item label-width="0">
                <div class="TagTitle">锚点图标尺寸</div>
                <span class="unit">长</span>
                <el-input v-model="form.iconSize.width" @keydown.native.stop placeholder="宽度(px)" style="width: 30%;;margin-left: 8px;" @change="edit()"></el-input>
                <span class="unit">px</span>
                <span class="unit">宽</span>
                <el-input v-model="form.iconSize.height" @keydown.native.stop placeholder="高度(px)" style="width: 30%;margin-left: 8px;" @change="edit()"></el-input>
                <span class="unit">px</span>
            </el-form-item>
            <el-form-item label="锚点面板颜色" class="colorBox" label-width="100px">
                <div class="colorContent">
                    <el-color-picker @change="edit" v-model="form.color" show-alpha></el-color-picker>
                    <span>{{ form.color }}</span>
                </div>
            </el-form-item>
            <el-form-item label="副标题内容" label-width="100px">
                <el-input v-model="form.section" @keydown.native.stop @change="edit()"></el-input>
            </el-form-item>
            <el-form-item label="文本内容" label-width="100px">
                <el-input v-model="form.textContent" @keydown.native.stop @change="edit()"></el-input>
            </el-form-item>
            <el-form-item label="标签名称字号" label-width="100px">
                <el-input v-model="form.labelNameFontSize" @keydown.native.stop @change="edit()"></el-input>
            </el-form-item>
            <el-form-item label="副标题字号" label-width="100px">
                <el-input v-model="form.sectionFontSize" @keydown.native.stop @change="edit()"></el-input>
            </el-form-item>
            <el-form-item label="文本内容字号" label-width="100px">
                <el-input v-model="form.textContentFontSize" @keydown.native.stop @change="edit()"></el-input>
            </el-form-item>
            <el-form-item label-width="0">
                <el-checkbox v-model="form.bAnchorAlwaysDisplay" @change="edit()">拉远时自动隐藏</el-checkbox>
            </el-form-item>
        </template>
        <!-- 自定义数据面板标签 -->
        <template v-else-if="['customize','anchorCustomize','customizeInWorld'].includes(form.type)">
            <el-form-item v-if="form.type==='anchorCustomize'" label="锚点图标" label-width="130px">
                <SingleUpload v-model="form.tagUrl" url="/tagControl/uploadTagImg" accept="image/png" @success="uploadSuccess"></SingleUpload>
            </el-form-item>
            <el-form-item v-if="form.type==='customizeInWorld'" label="面板发光强度" label-width="130px">
                <el-input v-model="form.intensityOfEmissiveColor" @keydown.native.stop v-only-number="{precision:1}" @change="edit()"></el-input>
            </el-form-item>
            <el-form-item label="数据面板背景图片" label-width="130px">
                <SingleUpload v-model="form.iconPath" url="/tagControl/uploadTagImg" accept="image/png" @success="uploadSuccessBg"></SingleUpload>
            </el-form-item>
            <div class="TagTitle">数据表信息</div>
            <el-table class="table" :data="form.tableStyle" size="mini" :show-header="false" :span-method="objectSpanMethods">
                <el-table-column align="center" v-for="(item, index) in form.slotNum.column" :key="index">
                    <template slot-scope="scope">
                        <el-input :class="{focusInput:focusInput.rowIndex===scope.$index&&focusInput.colIndex===index}" 
                        @focus="focusTableItem(scope.row,{ rowIndex: scope.$index, colIndex: index })" @change="changeTableName(scope.row)" v-model="scope.row[`text${index+1}`]"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <template v-if="focusInput.rowIndex > -1">
                <div class="TagTitle">单元格信息</div>
                <el-form-item label="单元格内容" label-width="130px">
                    <el-input v-model="styleForm.titleData" @keydown.native.stop @change="editData()"></el-input>
                </el-form-item>
                <el-form-item prop="fontColor" label="文字颜色" class="colorBox">
                    <div class="colorContent">
                        <el-color-picker v-model="styleForm.fontColor" show-alpha  @change="editData()"></el-color-picker>
                        <span>{{ styleForm.fontColor }}</span>
                    </div>
                </el-form-item>
            </template>
        </template>
        <!-- 其他类型普通标签 -->
        <template v-else>
            <el-form-item label-width="0">
                <div class="TagTitle">图标尺寸</div>
                <span class="unit">长</span>
                <el-input v-model="form.iconSize.width" @keydown.native.stop placeholder="宽度(px)" style="width: 30%;;margin-left: 8px;" @change="edit()"></el-input>
                <span class="unit">px</span>
                <span class="unit">宽</span>
                <el-input v-model="form.iconSize.height" @keydown.native.stop placeholder="高度(px)" style="width: 30%;margin-left: 8px;" @change="edit()"></el-input>
                <span class="unit">px</span>
            </el-form-item>
            <el-form-item label="背景颜色" class="colorBox">
                <div class="colorContent">
                    <el-color-picker @change="edit" v-model="form.color" show-alpha></el-color-picker>
                    <span>{{ form.color }}</span>
                </div>
            </el-form-item>
            <el-form-item label="线框颜色" class="colorBox">
                <div class="colorContent">
                    <el-color-picker v-model="form.color1" show-alpha></el-color-picker>
                    <span>{{ form.color1 }}</span>
                </div>
            </el-form-item>
            <el-form-item label="文字颜色" class="colorBox">
                <div class="colorContent">
                    <el-color-picker v-model="form.color2" show-alpha></el-color-picker>
                    <span>{{ form.color2 }}</span>
                </div>
            </el-form-item>
        </template>
        <el-form-item label="内容面板隐藏距离" label-width="130px">
            <el-input v-model="form.autoHiddenDistance" @keydown.native.stop style="width: 70%;" @change="edit()"></el-input>
            <span class="unit">cm</span>
        </el-form-item>
    </el-form>
</template>

<script>
import { listUserTag, updateTags, sendDataToTag, clickTag } from '@/api/resource/tag.js'
import { TagtypeList, fontType } from './json'
import SingleUpload from "@/components/Upload/singleUpload.vue"
export default {
    components: { SingleUpload },
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            fontType,
            newTagtypeList: TagtypeList,
            form: {
                changeType: [],
                location: {},
                scale: {
                    x:1,
                    y:1,
                    z:1
                },
                rotation: {
                    p:0,
                    y:0,
                    r:0
                },
                iconSize: {},
                slotNum: {
                    row:4,
                    column:3,
                },
                tableStyle: []
            },
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
            focusInput: {},//选中的表格表单
        }
    },
    watch: {
        'data.clickTagData'(val){
            if(!val) return
            this.getData(val)
        }
    },
    computed: {},
    created() {},
    mounted() {},
    methods: {
        getData(val){
            this.form = this.$options.data().form
            if(val.type==='anchor'){
                this.form = { ...this.form, labelNameFontSize: 20, sectionFontSize: 20, textContentFontSize:16, ...val }
            }else if(['anchorCustomize','customize','customizeInWorld'].includes(val.type)){
                this.form = { 
                    ...this.form,
                    ...val,
                    iconPath: val.tagStyleInfo.iconPath,
                    slotNum: { row: val.tagStyleInfo.slotNum.split('*')[0], column: val.tagStyleInfo.slotNum.split('*')[1] },
                }
                this.changeTableSize()
            }else{
                this.form = { ...this.form, ...val }
            }
            if(val.location){
                let location = val.location.split(' ')
                this.form.location = {
                    x: location[0].split('=')[1],
                    y: location[1].split('=')[1],
                    z: location[2].split('=')[1]
                }
            }
            if(val.scale){
                let scale = val.scale.split(' ')
                this.form.scale = {
                    x: scale[0].split('=')[1],
                    y: scale[1].split('=')[1],
                    z: scale[2].split('=')[1]
                }
            }
            if(val.rotation){
                let rotation = val.rotation.split(' ')
                this.form.rotation = {
                    p: rotation[0].split('=')[1],
                    y: rotation[1].split('=')[1],
                    r: rotation[2].split('=')[1]
                }
            }
            if(val.iconSize){
                let iconSize = val.iconSize.split('*')
                this.form.iconSize = {
                    width: iconSize[0],
                    height: iconSize[1],
                }
            }      
            if(val?.tagStyleInfo?.labelStyleUuid){
                this.$set(this.form,'changeType',[val.type, val?.tagStyleInfo?.labelStyleUuid])
            }else{
                this.$set(this.form,'changeType',[val.type])
            }
            this.typeData()
        },
        // 类型数据
        typeData(){
            let arr = [
                {
                    name:'自定义标签',
                    key: ['anchorCustomize','customize','customizeInWorld'].includes(this.form.type) ? this.form.type: 'anchorCustomize',
                    children:[]
                }
            ]
            listUserTag({userId: this.data.userId}).then(res=>{
                res.data.forEach(e=>{
                    e.children.forEach(eChild=>{
                        if(['anchorCustomize','customize','customizeInWorld'].includes(eChild.type)){
                            arr[0].children.push({ ...eChild, key: eChild.tagStyle.labelStyleUuid })
                        }
                    })
                })
                this.newTagtypeList = TagtypeList.concat(arr)
            })
        },
        // 合并列
        objectSpanMethods({ row, column, rowIndex, columnIndex }){
            if (rowIndex === 0) {
                return { rowspan: 1, colspan: this.form.slotNum.column };
            }
        },
        rgbaToHex(rgba){
            if(!rgba) return ''
            if(rgba.indexOf('#')>-1){
                return rgba
            }
            var values = rgba.replace(/rgba?\(/, '').replace(/\)/, '').replace(/[\s+]/g, '').split(',');
            var a = parseFloat(values[3] || 1),
            r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
            g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
            b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
            return "#" + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
        },
        // 点击表格编辑样式
        focusTableItem(arr, { rowIndex, colIndex }){
            this.focusInput = { rowIndex, colIndex }
            this.styleForm = arr.slotList[colIndex]&&Object.keys(arr.slotList[colIndex]) ? arr.slotList[colIndex]: this.$options.data().styleForm
            this.form.tableStyle[rowIndex].slotList[colIndex] = this.styleForm
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
            let tagData = this.form.tagData && JSON.parse(this.form.tagData) || {}
            let fontColorArr = new Array(this.form.slotNum.column).fill(tagData.titleColor).concat(tagData.slotColorList)
            let titleDataArr = new Array(this.form.slotNum.column).fill(tagData.titleData).concat(tagData.slotDataList)
            let newSlotList = this.form.tagStyleInfo && (new Array(this.form.slotNum.column).fill(JSON.parse(this.form.tagStyleInfo.title))).concat(JSON.parse(this.form.tagStyleInfo.slotList))
            for (let i = 0; i < this.form.slotNum.row+1; i++) {    
                slotList = []
                for (let index = 0; index < this.form.slotNum.column; index++) {
                    let hasList = newSlotList[arrIndex]
                    let fontColor = fontColorArr[arrIndex] || hasList?.fontColor || this.styleForm.fontColor
                    let slotDataList = titleDataArr[arrIndex]
                    let title = this.form.tableStyle[i]?.[`text${index+1}`] || slotDataList || ((i===0&&index===0) ? 'Title' : this.numberToLLetter(index+1)+i)
                    this.$set(obj, 'text' + (index+1), title)
                    slotList.push({
                        ...hasList,
                        margin: hasList?.margin.split(',') || this.styleForm.margin,
                        padding: hasList?.padding.split(',') || this.styleForm.padding, 
                        size: { width: hasList?.size.split('*')[0] || this.styleForm.size.width, height: hasList?.size.split('*')[1] || this.styleForm.size.height},
                        titleData:title,
                        fontColor
                    })
                    arrIndex++;
                }
                arr.push({ ...JSON.parse(JSON.stringify(obj)), slotList })
            }
            this.form.tableStyle = arr
        },
        edit(){
            let { labelName, autoHiddenDistance, tagId, type, location, rotation, scale, section, textContent, 
                labelNameFontSize, sectionFontSize, textContentFontSize, bAnchorAlwaysDisplay, intensityOfEmissiveColor } = this.form
            let newUrl = this.form.tagUrl && this.form.tagUrl.substring(this.form.tagUrl.lastIndexOf("\/") + 1,this.form.tagUrl.length)
            let data = {
                labelName,
                type,
                location,
                uuid:tagId,
                autoHiddenDistance,
            }
            if(type==='default'){
                data = {
                    ...data,
                    iconPath: newUrl,
                    iconSize: (this.form.iconSize.width||'') + '*' + (this.form.iconSize.height||''),
                    bgColor: this.rgbaToHex(this.form.color),
                }
            } else if(type==='anchor'){
                data = {
                    ...data,
                    iconPath: newUrl,
                    iconSize: (this.form.iconSize.width||'') + '*' + (this.form.iconSize.height||''),
                    bgColor: this.rgbaToHex(this.form.color),
                    section,
                    textContent,
                    labelNameFontSize,
                    sectionFontSize,
                    textContentFontSize,
                    bAnchorAlwaysDisplay,
                }
            } else if(['customize','anchorCustomize','customizeInWorld'].includes(type)){
                let iconPath = this.form.iconPath && this.form.iconPath.substring(this.form.iconPath.lastIndexOf("\/") + 1,this.form.iconPath.length)
                data = {
                    ...data,
                    tagUrl: newUrl,
                    iconPath,
                    labelStyleUuid: this.form.changeType[this.form.changeType.length-1] 
                }
                if(type === 'customizeInWorld'){
                    data = {
                        ...data,
                        rotation:`P=${rotation.p} Y=${rotation.y} R=${rotation.r}`,
                        scale:`X=${scale.x} Y=${scale.y} Z=${scale.z}`,
                        intensityOfEmissiveColor,
                    }
                }
            }else{
                data = {
                    ...data,
                    iconSize: (this.form.iconSize.width||'') + '*' + (this.form.iconSize.height||''),
                    bgColor: this.rgbaToHex(this.form.color),
                }
            }
            updateTags({ taskId: this.form.taskid }, [data]).then(()=>{
                this.$message.success('修改成功')
                this.getAppIdTag()
            })
        },
        // 获取标签数据
        getAppIdTag(){
            let params = {
                taskId: this.data.taskId,
                tagId: this.form.tagId
            }
            clickTag(params)
        },
        // 改变标签类型
        changeType(e){
            this.form.type = e[0]
            this.editAndReList()
        },
        editAndReList(){
            this.edit()
            setTimeout(()=>{
                this.$emit('onSuccess')
            },500)
        },
        // 数据表的内容接口请求
        editDataApi(){
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
            let slotDataList =  slotList.slice(+this.form.slotNum.column).map(e=>{return e.titleData})
            let slotColorList =  slotList.slice(+this.form.slotNum.column).map(e=>{return this.rgbaToHex(e.fontColor)})
            let params = {
                taskId: this.data.taskId,
                tagId: this.form.tagId,
                titleData: slotList[0].titleData,
                titleColor: this.rgbaToHex(slotList[0].fontColor)
            }
            let data = {
                slotColorList,
                slotDataList,
                tagId: this.form.tagId,
                titleColor: this.rgbaToHex(slotList[0].fontColor),
                titleData: slotList[0].titleData,
            }
            sendDataToTag(params,data).then(()=>{
                this.$message.success('修改成功')
            })
        },
        editData(){
            this.form.tableStyle[this.focusInput.rowIndex].slotList[this.focusInput.colIndex] = this.styleForm
            this.form.tableStyle[this.focusInput.rowIndex][`text${this.focusInput.colIndex+1}`] = this.styleForm.titleData
            this.editDataApi()
        },
        changeTableName(obj){
            this.styleForm.titleData = obj[`text${this.focusInput.colIndex+1}`]
            this.editDataApi()
        },
        uploadSuccess(e){
            if(e){
                this.$set(this.form, 'tagUrl', `${this.$config.VUE_APP_REQUEST_URL}/tag/${e}`)
                this.editAndReList()
            }
        },
        uploadSuccessBg(e){
            if(e){
                this.$set(this.form, 'iconPath', `${this.$config.VUE_APP_REQUEST_URL}/tag/${e}`)
                // this.edit()
            }
        },
    }
}
</script>
<style lang="less" scoped>
.tagBigTitle{
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #00AAF0;
    margin: 0 0 15px 0;
}
.focusInput{
    border: 2px solid #3e9af8;
    border-radius: 5px;
}
.editTag{
    color: #ffffff;
    border-top: 1px solid rgba(70, 70, 70, 1);
    margin: 20px 0px;
    padding: 15px 4px;
    /deep/.el-form-item__label{
        color: #ffffff;
    }
    /deep/.el-upload{
        width: 80px;
        height: 80px;
        background: #24262B;
        border: 1px solid #727272;
    }
    .coordinate{
        .coordinateItemInput{
            text-align: center;
            font-size: 12px;
        }
        i{
            font-size: 20px;
            color: #9FAFC2;
            cursor: pointer;
            vertical-align: middle;
        }
    }
    .colorBox{
        /deep/.el-form-item__content{
            line-height: 30px;
        }
    }
    .colorContent{

        background: #24262B;
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
    .unit{
        margin-left: 6px;
    }
    .TagTitle{
        margin: 0 10px 16px 10px;
    }
    .table{
        margin: 10px 0 25px 12px;
        background: rgba(36, 38, 43, 1);
        /deep/tr{
            background: rgba(36, 38, 43, 1);
        }
    }
    /deep/.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
        background: none!important;
    }
    /deep/.el-table td.el-table__cell, /deep/.el-table th.el-table__cell.is-leaf{
        border-bottom: 1px solid rgba(114, 114, 114, 1);
    }
    .el-table--border::after, .el-table--group::after, .el-table::before{
        background: rgba(36, 38, 43, 1);
    }
}
</style>
<style lang="less">
.styleCascader{
    .el-cascader-panel{
        flex-direction: row-reverse;
    }
}
</style>
