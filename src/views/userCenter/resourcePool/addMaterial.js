// 替换材质
import { mapGetters, mapState } from 'vuex'
import { getMaterialByMatId, changeMaterialByInstruction, addMaterialForApp, addMaterialForUser } from "@/api/userCenter/resourcePool.js";
export default {
    props: {},
    data() {
        return {};
    },
    watch: {},
    computed: {
        ...mapGetters(["material","componentAllInfo","materialAllInfo"]),
    },
    created() {},
    mounted() {},
    destroyed () {},
    methods: {
        // 获取材质信息isPublic=true：添加材质
        getMaterial(matId,isPublic=true){
            getMaterialByMatId({ matId: matId || this.materialAllInfo.matId, isPublic }).then(res=>{
                if(isPublic){
                    this.addMaterial({matId:res.data.matId,matParam:JSON.parse(res.data.matParam)})
                }else{
                    this.$store.dispatch('material/changeSetting',{ key: "materialAllInfo", value: { ...res.data,matParam:JSON.parse(res.data.matParam),matImgPath:this.levels.activeContent.matImgPath} })
                    // 构件库替换构件的时候更新右边构件信息的图片
                    if(this.levels.level === 2){
                        let matList = JSON.parse(JSON.stringify(this.componentAllInfo.matList))
                        matList[this.material.activeMaterialIndex].imgPath = this.levels.activeContent.matImgPath
                        this.$store.dispatch('material/changeSetting',{ key: "componentAllInfo", value: {matList} })
                    }
                }
            })
        },
        // 添加材质
        addMaterial({matId, matParam, isPublic = true, textureId }){
            if(!matParam && !this.materialAllInfo.matParam){
                return this.$message.warning('请选择要替换的构件！')
            }
            let params = {
                userId: this.$route.query.userId || JSON.parse(sessionStorage.getItem("userid")) || 'travels',
                // appId: this.$parent.$parent.findPakId(),
                matId: matId || this.materialAllInfo.matId,
                isPublic,
                baseColorTextureId: this.material.openTexture==='基础' ? textureId : '',
                normalMapTextureId: this.material.openTexture==='法线' ? textureId : ''
            }
            addMaterialForUser(params, JSON.stringify(matParam || this.materialAllInfo.matParam)).then(res=>{
                let matList = JSON.parse(JSON.stringify(this.componentAllInfo.matList))
                matList[this.material.activeMaterialIndex].matId = res.data
                this.$store.dispatch('material/changeSetting',{ key: "componentAllInfo", value: {matList} })
                this.$store.dispatch('material/changeSetting',{ key: "materialAllInfo", value: {matId:res.data} })
                this.changeMaterial(res.data)
            })
        },
        // 替换材质
        changeMaterial(matId){
            let params = {
                taskId: this.data.taskId,
                appId: this.$parent.$parent.findPakId(),
                matId,
                isPublic: false,
                isUpdateSameMaterial: false,
            }
            let data = [{
                actorId:this.componentAllInfo.actorId,
                meshIndex:this.materialAllInfo.meshIndex,
                matIndex:this.materialAllInfo.matIndex,
                comType: this.data.pakIdMapweb,
                pakId:this.componentAllInfo.pakId
            }]
            changeMaterialByInstruction(params,JSON.stringify(data)).then(res=>{
                this.getMaterial(matId,false)
                this.$message.success('材质替换成功');

            })
        },
    },
};