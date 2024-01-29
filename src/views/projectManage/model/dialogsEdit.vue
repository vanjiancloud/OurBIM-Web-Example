<!-- 编辑项目 -->
<template>
    <el-dialog title="编辑项目" :visible.sync="dialogVisible" width="55%" :before-close="hide" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" ref="form" label-width="140px">
            <el-form-item label="项目名称：" prop="appName">
                <el-input v-model="form.appName"></el-input>
            </el-form-item>
            <el-form-item label="项目缩略图：">
                <SingleUpload v-model="form.screenImg" url="/appli/uploadThumbnail" />
            </el-form-item>
            <el-form-item label="基础程序路径：" v-if="['0', '3'].includes(form.appType)">
                <el-select v-model="form.isGis" @change="changeEditorEngine">
                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="主程序路径：" v-if="form.appType === '5'">
                <el-select v-model="form.startup" placeholder="请选择主程序路径">
                    <el-option :label="item" :value="item" v-for="item in form.startups ? form.startups.split(',') : []"
                        :key="item"></el-option>
                </el-select>
            </el-form-item>
            <div class="flexStart">          
                <el-form-item label="服务支持组件:" prop="gisPlugin" v-if="form.isGis === 'true'">
                    <el-select v-model="form.gisPlugin" placeholder="请选择" @change="changeGisPlugin">
                        <el-option :value="item.key" :label="item.name" v-for="(item,index) in gisPluginList" :key="index" :disabled="item.key==='arcGIS'"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="GIS坐标系：" v-if="form.isGis === 'true'">
                    <el-select v-model="form.gisCoordinateType" placeholder="请选择GIS坐标系">
                        <el-option value="WGS-84" label="WGS-84"></el-option>
                        <el-option value="GCJ-02" label="GCJ-02"></el-option>
                        <el-option value="BD-09" label="BD-09"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <el-form-item label="GIS底图:" prop="gisSuperMapInfo" v-if="form.isGis === 'true'">
                <el-select v-model="form.gisSuperMapInfo" placeholder="请选择" multiple style="width:100%">
                    <el-option :value="item.key" :label="item.name" v-for="(item,index) in mapInfoList" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目GIS原点:" required v-if="form.isGis === 'true'">
                <el-col :span="7">
                    <el-form-item prop="gisLongitude">
                        <el-input v-model="form.gisLongitude" placeholder="经度" v-only-number="{min:-180,max:180,precision:8}"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="GISMark" :span="1">°</el-col>
                <el-col :span="7">
                    <el-form-item prop="gisLatitude">
                        <el-input v-model="form.gisLatitude" placeholder="纬度" v-only-number="{min:-90,max:90,precision:8}"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="GISMark" :span="1">°</el-col>
                <el-col :span="7">
                    <el-form-item prop="gisAltitude">
                        <el-input v-model="form.gisAltitude" placeholder="海拔高度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="GISMark" :span="1">m</el-col>
            </el-form-item>
            <el-form-item :label="form.isGis==='true' ? 'BIM模型:' : '子模型列表:'" v-if="form.appType === '3' || (form.appType === '0' && form.isGis === 'true')">
                <el-card class="box-card">
                    <div v-for="(GISitem, index) in form.gisInfo" :key="index" class="flexStart">
                        <el-tooltip effect="dark" :content="GISitem.name" placement="top">
                            <div class="wordEllipsis"> {{ GISitem.name }} </div>
                        </el-tooltip>
                        <!-- <div v-if="form.isGis === 'true'" class="flexStart">
                            <el-form-item :prop="'gisInfo.' + index + '.longitude'"
                                :rules="[{ required: true, validator: validaLongitude, trigger: 'blur' }]">
                                <el-input size="small" placeholder="请输入经度" v-model="GISitem.longitude"
                                    style="width:90%"></el-input>
                                <span class="gis-input-label">°</span>
                            </el-form-item>
                            <el-form-item :prop="'gisInfo.' + index + '.latitude'"
                                :rules="[{ required: true, validator: validaLatitude, trigger: 'blur' }]">
                                <el-input size="small" placeholder="请输入纬度" v-model="GISitem.latitude"
                                    style="width:90%"></el-input>
                                <span class="gis-input-label">°</span>
                            </el-form-item>
                            <el-form-item :prop="'gisInfo.' + index + '.altitude'"
                                :rules="[{ required: true, message: '海拔高度不能为空', trigger: 'blur' }]">
                                <el-input size="small" placeholder="请输入海拔高度" v-model="GISitem.altitude"
                                    style="width:86%"></el-input>
                                <span class="gis-input-label">m</span>
                            </el-form-item>
                        </div> -->
                        <el-button v-if="form.gisInfo.length > 2" type="text" class="blueText"
                            @click="delModel(index)">移除</el-button>
                    </div>

                    <!-- 链接模型展示 -->
                    <div class="addNewModel" v-if="form.appType === '3'">
                        <el-button v-if="!modelList.length" type="primary" @click="addModelClick()" plain class="bluePlainBtn1">添加模型</el-button>
                        <el-select v-model="form.modelListValue" clearable placeholder="请选择" size="mini"
                            @change="modelListValChange" v-else>
                            <el-option v-for="item in modelList" :key="item.appid" :label="item.appName"
                                :value="item.appid"></el-option>
                        </el-select>
                    </div>
                </el-card>
            </el-form-item>
            <el-form-item label="链接GIS数据服务：" v-if="form.isGis === 'true'">
                <el-card class="box-card">
                    <div v-for="(value, key) in form.gisServerMap" class="flexBetween" :key="key">
                        <el-tooltip class="item" effect="dark" :content="value" placement="top">
                            <div class="textEllipsis gis-serve"> {{ value }} </div>
                        </el-tooltip>
                        <el-button type="text" class="blueText" @click="deleteGisServe(key)">移除</el-button>
                    </div>
                    <el-button v-if="!selectGisList.length" type="primary" @click="showSelectGis()" plain class="bluePlainBtn1">添加GIS服务</el-button>
                    <el-select v-model="form.selectGis" placeholder="请选择" size="mini" @change="addGisServe" v-else>
                        <el-option v-for="item in selectGisList" :key="item.gisId" :label="item.gisServerName"
                            :value="item.gisId"></el-option>
                    </el-select>
                </el-card>
            </el-form-item>
            <el-form-item label="最大并发数：" prop="maxInstance">
                <el-input v-model="form.maxInstance" v-only-number="{max:9999,min:1,precision:0}"></el-input>
            </el-form-item>
            <el-form-item label="启动参数:" v-if="form.appType === '5'">
                <el-input v-model="form.startNum"></el-input>
            </el-form-item>
            <el-form-item label="是否预启动:" v-if="form.appType !== '5'">
                <el-radio-group v-model="form.isPre">
                    <el-radio label="true">是</el-radio>
                    <el-radio label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="鼠标操作模式：">
                <el-select v-model="form.doMouse" placeholder="请选择操作模式">
                    <el-option label="非锁定模式" value="0"></el-option>
                    <el-option label="锁定模式" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="窗口显示模式：">
                <el-select v-model="form.displayWindow" placeholder="请选择显示模式">
                    <el-option label="完全填充" value="0"></el-option>
                    <el-option label="尽量填充" value="1"></el-option>
                    <el-option label="原始大小" value="2"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide">取 消</el-button>
            <el-button class="blueBtn" type="primary" @click="submit" :loading="btnLoading">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { gisPluginList, gisSuperMapList } from "@/views/projectManage/GISList/json"
import SingleUpload from "@/components/Upload/singleUpload.vue"
import { updateProject } from "@/api/projectManage/model.js";
export default {
    components: { SingleUpload },
    props: {
        ListLinkModel: {
            type: Array,
            default: () => { return [] }
        },
        GISModel: {
            type: Array,
            default: () => { return [] }
        }
    },
    data() {
        // const validaLongitude = (rule, value, callback) => {
        //     if (!value) {
        //         callback(new Error('经度不能为空'))
        //     }
        //     if (Number(value) > 180 || Number(value) < -180) {
        //         callback(new Error('经度范围为-180~180'))
        //     } else {
        //         callback()
        //     }
        // }
        // const validaLatitude = (rule, value, callback) => {
        //     if (!value) {
        //         callback(new Error('纬度不能为空'))
        //     }
        //     if (Number(value) > 90 || Number(value) < -90) {
        //         callback(new Error('纬度范围为-90~90'))
        //     } else {
        //         callback()
        //     }
        // }
        const validGisSuperMapInfo = (rule, value, callback) => {
            if(value && value.length === 1 && value[0] === 'cta'){
                callback(new Error('天地图地形注记不能单独添加'));
            }else{
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
            },
            rules: {
                maxInstance: [{ required: true, message: "请输入1-9999的正整数", trigger: "blur" }],
                gisPlugin: { required: true, message: '请选择服务支持组件', trigger: 'blur' },
                gisSuperMapInfo: { required: false, validator: validGisSuperMapInfo, trigger: 'blur' },
                gisLongitude: [{required: true,message: '请输入经度(-180°~180°)',trigger: 'blur'}],
                gisLatitude: [{required: true,message: '请输入纬度(-90°~90°)',trigger: 'blur'}],
                gisAltitude: [{required: true,message: '请输入海拔高度',trigger: 'blur'}],
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
    mounted() {},
    methods: {
        show(row) {
            this.dialogVisible = true
            this.form = this.$options.data().form
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
                this.form = row
                this.changeGisPlugin()
                this.$set(this.form, 'gisCoordinateType', row.gisCoordinateType || 'WGS-84')
                this.$set(this.form, 'gisSuperMapInfo', row.gisSuperMapInfo && row.gisSuperMapInfo.split(',') || [])
                let gisInfo = this.form.gisInfo && (JSON.parse(this.form.gisInfo).constructor === Object ? [JSON.parse(this.form.gisInfo)] : JSON.parse(this.form.gisInfo)) || []
                let newGisInfo = this.form.combineId&&this.form.combineId.split(',').map((e,i) => {
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
            if(val){
                this.form.gisSuperMapInfo = []
            }
            this.mapInfoList = gisSuperMapList.filter(e => { return e.type === this.form.gisPlugin })
        },
        // 点击添加模型按钮
        addModelClick(type = false) {
            const combineIds = this.form.gisInfo.map(e => e.appId)
            this.modelList = this.ListLinkModel.filter(item => !combineIds.includes(item.appid))
            if (!this.modelList.length && !type) {
                this.$message.warning('已添加全部模型，没有更多模型可供添加')
            }
        },
        // gis信息-------添加的模型
        modelListValChange(appId) {
            const obj = this.modelList.find(item => { return item.appid === appId })
            if (appId) {
                this.form.gisInfo.push({
                    name: obj.appName,
                    appId: obj.appid,
                    longitude: '',
                    latitude: '',
                    altitude: ''
                })
                this.modelList = []
                this.form.modelListValue = ''
            }
        },
        // 移除模型
        delModel(index) {
            this.$confirm('确定移除吗', '提示').then(() => {
                this.form.gisInfo.splice(index, 1)
                if (this.modelList.length) {
                    this.addModelClick(true)
                }
            })
        },
        // 找出未被选中的gis服务数据
        showSelectGis(type = false) {
            let arr = this.form.gisServerMap && Object.keys(this.form.gisServerMap) || []
            this.selectGisList = this.GISModel.filter(item => !arr.includes(item.gisId))
            if (!this.selectGisList.length && !type) {
                this.$message.warning('已添加全部gis服务，没有更多gis服务可供添加')
            }
        },
        addGisServe(data) {
            const obj = this.selectGisList.find(item => { return item.gisId === data })
            this.$set(this.form, 'gisServerMap', { ...this.form?.gisServerMap, [obj.gisId]: obj.gisServerName })
            this.selectGisList = []
            this.form.selectGis = ''
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
                this.$set(this.form,'gisInfo',arr)
            }
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                let data = {
                    ...this.form,
                    // 如果不是链接模型,这里的数据就需要传对象,链接模型则需要传数组
                    gisInfo: this.form.appType !== '3' ? JSON.stringify(this.form.gisInfo?.[0]) : JSON.stringify(this.form.gisInfo),
                    combineId: this.form.gisInfo&&this.form.gisInfo.map(e => e.appId).join(',')||'',
                    gisServerList: this.form.gisServerMap&&Object.keys(this.form.gisServerMap).join(',')||'',
                    gisSuperMapInfo: this.form?.gisSuperMapInfo.join(',') || '',
                }
                delete data.gisServerMap
                delete data.sonAppMap
                this.btnLoading = true
                updateProject(data).then(() => {
                    this.btnLoading = false
                    this.$message.success('项目信息更新成功')
                    this.hide()
                    this.$parent.$parent.getAllModelList()
                }).catch(()=>{
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
}
</style>