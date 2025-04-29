const getters = {
  user: state => state.user,
  material: state => state.material,
  materialAllInfo: state => state.material.materialAllInfo,
  componentAllInfo: state => state.material.componentAllInfo,
  isAnimationLinkage: state => state.material.isAnimationLinkage,
};
export default getters;
