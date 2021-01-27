module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  updateHospital (hospital) {
    this.$axios.put(
      `http://localhost:5050/editHospital`,
      JSON.stringify(hospital),
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    )
  }
}
