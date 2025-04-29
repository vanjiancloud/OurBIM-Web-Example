<!-- 编辑项目 -->
<template>
    <el-dialog title="管理链接" :visible.sync="dialogVisible" width="55%" append-to-body :before-close="hide" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" ref="form" label-width="140px">
            <el-form-item label="项目名称：" prop="appName">
                <el-input v-model="form.appName"></el-input>
            </el-form-item>
            <el-form-item label="GIS底图:" prop="gisSuperMapInfo" v-if="form.isGis === 'true'">
                <el-select v-model="form.gisSuperMapInfo" placeholder="请选择" multiple style="width:100%">
                    <el-option :value="item.key" :label="item.name" v-for="(item, index) in mapInfoList"
                        :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否启动地形:" v-if="form.isGis === 'true'">
                <el-radio-group v-model="form.gisTerrain">
                    <el-radio label="true">是</el-radio>
                    <el-radio label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="链接GIS数据服务：" v-if="form.isGis === 'true'">
                <el-card class="box-card">
                    <div v-for="(value, key) in form.gisServerMap" class="flexBetween" :key="key">
                        <el-tooltip class="item" effect="dark" :content="value" placement="top">
                            <div class="textEllipsis gis-serve"> {{ value }} </div>
                        </el-tooltip>
                        <div>
                            <el-button
                            v-if="((form.gisInfo || form.gisServerMap) && (form.gisInfo.length + Object.keys(form.gisServerMap).length) >= 2) || (form.gisInfo && form.gisInfo.length >= 2)"
                            type="text" class="blueText" @click="editGisServe(key)">编辑</el-button>
                        <el-button
                            v-if="((form.gisInfo || form.gisServerMap) && (form.gisInfo.length + Object.keys(form.gisServerMap).length) >= 2) || (form.gisInfo && form.gisInfo.length >= 2)"
                            type="text" class="blueText" @click="deleteGisServe(key)">移除</el-button>
                        </div>
                    </div>
                    <el-button v-if="!selectGisList.length" type="primary" @click="showSelectGis()" plain
                        class="bluePlainBtn1">添加GIS服务</el-button>
                    <el-select v-model="form.selectGis" placeholder="请选择" size="mini" @change="addGisServe" v-else>
                        <el-option v-for="item in selectGisList" :key="item.gisId" :label="item.gisServerName"
                            :value="item.gisId"></el-option>
                    </el-select>
                </el-card>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide">取 消</el-button>
            <el-button class="blueBtn" type="primary" @click="submit" :loading="btnLoading">确 定</el-button>
        </span>
        <!-- 编辑GIS服务 -->
        <dialog-project ref="refProject" :modelObj="form" @editSucess="editSucess" />
    </el-dialog>
</template>

<script>
import { gisPluginList, gisSuperMapList } from "@/views/projectManage/GISList/json"
import SingleUpload from "@/components/Upload/singleUpload.vue"
import dialogProject from './dialogProject.vue'
import { updateGisProject } from "@/api/projectManage/model.js";
export default {
    components: { SingleUpload, dialogProject },
    props: {
        GISModel: {
            type: Array,
            default: () => { return [] }
        },
        data: {
            type: Object,
            default: () => { }
        },
    },
    data() {
        const validGisSuperMapInfo = (rule, value, callback) => {
            if (value && value.length === 1 && value[0] === 'cta') {
                callback(new Error('天地图地形注记不能单独添加'));
            } else {
                callback();
            }
        };
        return {
            // validaLongitude,
            // validaLatitude,
            gisPluginList,
            dialogVisible: false,
            form: {
                gisCoordinateType: "WGS-84",
                gisTerrain: "true"
            },
            rules: {
                maxInstance: [{ required: true, message: "请输入1-9999的正整数", trigger: "blur" }],
                gisPlugin: { required: true, message: '请选择服务支持组件', trigger: 'blur' },
                gisSuperMapInfo: { required: false, validator: validGisSuperMapInfo, trigger: 'blur' },
                gisLongitude: [{ required: true, message: '请输入经度(-180°~180°)', trigger: 'blur' }],
                gisLatitude: [{ required: true, message: '请输入纬度(-90°~90°)', trigger: 'blur' }],
                gisAltitude: [{ required: true, message: '请输入海拔高度', trigger: 'blur' }],
            },
            options: [
                {
                    value: 'true',//GIS
                    label: "OurGISEngine",
                },
                {
                    value: 'false',//BIM
                    label: "OurBIMEngine",
                },
            ],
            modelList: [],//还未被选的模型
            selectGisList: [],//还未被选的服务
            mapInfoList: [],//底图
            btnLoading: false,
        }
    },
    watch: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        editSucess(){
            this.hide()
        },
        show(row) {
            this.dialogVisible = true
            this.form = this.$options.data().form
            this.$nextTick(() => {
                let msgList = []
                console.log('row',row)
                const typeMsg = typeof(row.gisServerMsgList)
                if (typeMsg === 'string') {
                    msgList = row.gisServerMsgList ? JSON.parse(row.gisServerMsgList) : []
                } else if (typeMsg === 'object') {
                    msgList = row.gisServerMsgList
                }
                this.$refs.form.clearValidate()
                this.form = { ...this.form, ...row }
                this.form.gisServerMsgList = msgList
                this.changeGisPlugin()
                this.$set(this.form, 'gisCoordinateType', row.gisCoordinateType || 'WGS-84')
                this.$set(this.form, 'gisSuperMapInfo', row.gisSuperMapInfo && row.gisSuperMapInfo.split(',') || [])
                let gisInfo = this.form.gisInfo && (JSON.parse(this.form.gisInfo).constructor === Object ? [JSON.parse(this.form.gisInfo)] : JSON.parse(this.form.gisInfo)) || []
                let newGisInfo = this.form.combineId && this.form.combineId.split(',').map((e, i) => {
                    return {
                        appId: e,
                        ...gisInfo[i],
                        name: row.sonAppMap ? row.sonAppMap[e] : row.appName
                    }
                })
                this.$set(this.form, 'gisInfo', newGisInfo)
            })
        },
        hide() {
            this.dialogVisible = false
        },
        changeGisPlugin(val) {
            if (val) {
                this.form.gisSuperMapInfo = []
            }
            this.mapInfoList = gisSuperMapList.filter(e => { return e.type === this.form.gisPlugin })
        },
        // 找出未被选中的gis服务数据
        showSelectGis(type = false) {
            let arr = this.form.gisServerMap && Object.keys(this.form.gisServerMap) || []
            this.selectGisList = this.GISModel.filter(item => !arr.includes(item.gisId))
            if (!this.selectGisList.length && !type) {
                this.$message.warning('已添加全部gis服务，没有更多gis服务可供添加')
            }
        },
        // gis信息-------添加的模型
        modelListValChange(appId) {
            const obj = this.modelList.find(item => { return item.appid === appId })
            if (appId) {
                this.form.gisInfo ? this.form.gisInfo.push({
                    name: obj.appName,
                    appId: obj.appid,
                    longitude: '',
                    latitude: '',
                    altitude: ''
                }) :
                    this.form.gisInfo = [{
                        name: obj.appName,
                        appId: obj.appid,
                        longitude: '',
                        latitude: '',
                        altitude: ''
                    }]
                this.modelList = []
                this.form.modelListValue = ''
            }
        },
        addGisServe(data) {
            const obj = this.selectGisList.find(item => { return item.gisId === data })
            this.$set(this.form, 'gisServerMap', { ...this.form?.gisServerMap, [obj.gisId]: obj.gisServerName })
            this.selectGisList = []
            this.form.selectGis = ''
        },
        // 编辑GIS服务
        editGisServe(row){
            console.log(this.form, row);
            const realObj = this.form.gisServerMsgList.find(item => item.gisId === row)
            if (!realObj) {
                this.$message.warning('暂无GIS信息')
            }
            this.$refs.refProject.show('编辑', realObj || JSON.parse(JSON.stringify(realObj)), this.form.gisServerMsgList);
        },
        // 移除已添加的gis
        deleteGisServe(key) {
            this.$confirm('确定移除吗', '提示').then(() => {
                this.$delete(this.form.gisServerMap, key)
                if (this.selectGisList.length) {
                    this.showSelectGis(true)
                }
            })
        },
        // 切换基础程序路径
        changeEditorEngine(value) {
            if (value === 'true' && !this.form.gisInfo?.length) {
                let arr = [{
                    name: this.form.appName,
                    appId: this.form.appid,
                    longitude: '',
                    latitude: '',
                    altitude: ''
                }]
                this.$set(this.form, 'gisInfo', arr)
            }
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                console.log(this.form?.gisSuperMapInfo)
                let data = {
                    taskId: this.data.taskId,
                    id: this.data.appId,
                    appName: this.form.appName,
                    gisServerList: this.form.gisServerMap && Object.keys(this.form.gisServerMap).join(',') || '',
                    gisSuperMapInfo: this.form?.gisSuperMapInfo.join(',') || '',
                    gisTerrain: this.form.gisTerrain
                }
                this.btnLoading = true
                updateGisProject(data).then(() => {
                    this.btnLoading = false
                    this.$message.success('项目信息更新成功')
                    this.hide()
                }).catch(() => {
                    this.btnLoading = false
                })
            })
        }
    }
}
</script>
<style lang="less" scoped>
.text {
    padding: 0 30px;
}

.tips {
    padding: 0 5px;

    span {
        color: #F56C6C;
        padding-right: 3px;
    }
}

.wordEllipsis {
    flex: 1;
    min-width: 100px;
    white-space: nowrap; //强制在一行显示
    overflow: hidden; //溢出隐藏
    text-overflow: ellipsis; //显示省略号
}</style>