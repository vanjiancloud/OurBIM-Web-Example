// 替换材质
import { mapGetters, mapState } from 'vuex'
import { getMaterialByMatId, changeMaterialByInstruction, addMaterialForApp, addMaterialForUser } from "@/api/userCenter/resourcePool.js";
export default {
  props: {},
  data() {
    return {
      actionType: null,
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["material", "componentAllInfo", "materialAllInfo"]),
  },
  created() { },
  mounted() { },
  destroyed() { },
  methods: {
    // 获取材质信息
    getMaterial(matId, isPublic = true, type = '1') {
      this.actionType = type;
      // 公共库
      if (type == '1') {
        getMaterialByMatId({ matId: matId || this.materialAllInfo.matId, isPublic }).then(res => {
          if (isPublic) {
            this.addMaterial({ matId: res.data.matId, matParam: JSON.parse(res.data.matParam) })
          }
        })
      }
      // 个人库
      if (type == '2') {
        getMaterialByMatId({ matId: matId || this.materialAllInfo.matId, isPublic }).then(res => {
          this.addMaterialToApp({ matId: res.data.matId, matParam: JSON.parse(res.data.matParam) })
        })
      }
      // 项目库
      if (type == '3') {
        getMaterialByMatId({ matId: matId || this.materialAllInfo.matId, isPublic }).then(res => {
          let matList = JSON.parse(JSON.stringify(this.componentAllInfo.matList))
          matList[this.material.activeMaterialIndex].matId = res.data.matId
          this.$store.dispatch('material/changeSetting', { key: "componentAllInfo", value: { matList } })
          this.$store.dispatch('material/changeSetting', { key: "materialAllInfo", value: { matId: res.data.matId } })
          this.changeMaterial(res.data.matId)
        })
      }
    },
    // 添加材质
    addMaterial({ matId, matParam, isPublic = true, textureId }) {
      if (!matParam && !this.materialAllInfo.matParam) {
        return this.$message.warning('请选择要替换的构件！')
      }
      let params = {
        userId: this.$route.query.userId || JSON.parse(sessionStorage.getItem("userid")) || 'travels',
        // appId: this.$parent.$parent.findPakId(),
        matId: matId || this.materialAllInfo.matId,
        isPublic,
        // baseColorTextureId: this.material.openTexture === 'BaseColorMap' ? textureId : '',
        // normalMapTextureId: this.material.openTexture === 'NormalMap' ? textureId : '',
      }
      // 添加材质到用户材质库
      addMaterialForUser(params, JSON.stringify(matParam || this.materialAllInfo.matParam)).then(res => {
        let matList = JSON.parse(JSON.stringify(this.componentAllInfo.matList))
        matList[this.material.activeMaterialIndex].matId = res.data
        this.$store.dispatch('material/changeSetting', { key: "componentAllInfo", value: { matList } })
        this.$store.dispatch('material/changeSetting', { key: "materialAllInfo", value: { matId: res.data } })
        this.changeMaterial(res.data)
      })
    },
    // 添加材质到项目材质库
    addMaterialToApp({ matId, matParam, isPublic = false, textureId }) {
      if (!matParam && !this.materialAllInfo.matParam) {
        return this.$message.warning('请选择要替换的构件！')
      }
      let params = {
        appId: this.$parent.$parent.findPakId() || this.data.appId,
        matId: matId || this.materialAllInfo.matId,
        isPublic,
        // baseColorTextureId: this.material.openTexture === 'BaseColorMap' ? textureId : '',
        // normalMapTextureId: this.material.openTexture === 'NormalMap' ? textureId : ''
      }
      // 添加材质到项目材质库
      addMaterialForApp(params, JSON.stringify(matParam || this.materialAllInfo.matParam)).then(res => {
        let matList = JSON.parse(JSON.stringify(this.componentAllInfo.matList))
        matList[this.material.activeMaterialIndex].matId = res.data
        this.$store.dispatch('material/changeSetting', { key: "componentAllInfo", value: { matList } })
        this.$store.dispatch('material/changeSetting', { key: "materialAllInfo", value: { matId: res.data } })
        this.changeMaterial(res.data)
      })
    },
    // 替换材质
    changeMaterial(matId) {
      let params = {
        taskId: this.data.taskId,
        appId: this.$parent.$parent.findPakId() || this.data.appId,
        matId,
        isPublic: false,
        isUpdateSameMaterial: false,
        isBatch: this.material.allMaterialChecked
      }
      let data = [{
        actorId: this.componentAllInfo.actorId,
        meshIndex: this.materialAllInfo.meshIndex,
        matIndex: this.materialAllInfo.matIndex,
        comType: this.data.pakIdMapweb,
        pakId: this.componentAllInfo.pakId
      }]
      changeMaterialByInstruction(params, JSON.stringify(data)).then(res => {
        // this.getMaterial(matId, false)
        getMaterialByMatId({ matId: matId, isPublic: false }).then(res => {
          this.$store.dispatch('material/changeSetting', {
            key: "materialAllInfo",
            value: {
              ...res.data,
              matParam: JSON.parse(res.data.matParam),
              matImgPath: this.levels.activeContent.matImgPath
            }
          })
          // 构件库替换构件的时候更新右边构件信息的图片
          if (this.levels.level === 2 || this.actionType == '3') {
            let matList = JSON.parse(JSON.stringify(this.componentAllInfo.matList))
            matList[this.material.activeMaterialIndex].imgPath = this.levels.activeContent.matImgPath
            this.$store.dispatch('material/changeSetting', { key: "componentAllInfo", value: { matList } })
          }
          this.$message.success('材质替换成功');
          this.refreshData();
        })
      })
    },
  },
};