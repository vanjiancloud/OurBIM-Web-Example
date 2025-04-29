<template>
    <div>
        <el-form-item label="坐标偏移">
        </el-form-item>
        <el-form-item label="坐标：">
            <el-col class="GISMark" :span="1">X</el-col>
            <el-col :span="7">
                <el-form-item>
                    <el-input v-model="form.q" placeholder="X"></el-input>
                </el-form-item>
            </el-col>
            <el-col class="GISMark" :span="1">Y</el-col>
            <el-col :span="7">
                <el-form-item>
                    <el-input v-model="form.w" placeholder="Y"></el-input>
                </el-form-item>
            </el-col>
            <el-col class="GISMark" :span="1">Z</el-col>
            <el-col :span="7">
                <el-form-item>
                    <el-input v-model="form.e" placeholder="Z"></el-input>
                </el-form-item>
            </el-col>
        </el-form-item>
        <el-form-item label="角度：">
            <el-col class="GISMark" :span="1">X</el-col>
            <el-col :span="7">
                <el-form-item>
                    <el-input v-model="form.a" placeholder="X"></el-input>
                </el-form-item>
            </el-col>
            <el-col class="GISMark" :span="1">Y</el-col>
            <el-col :span="7">
                <el-form-item>
                    <el-input v-model="form.s" placeholder="Y"></el-input>
                </el-form-item>
            </el-col>
            <el-col class="GISMark" :span="1">Z</el-col>
            <el-col :span="7">
                <el-form-item>
                    <el-input v-model="form.d" placeholder="Z"></el-input>
                </el-form-item>
            </el-col>
        </el-form-item>
        <el-form-item label="比例：">
            <el-col class="GISMark" :span="1">X</el-col>
            <el-col :span="7">
                <el-form-item>
                    <el-input v-model="form.z" placeholder="X"></el-input>
                </el-form-item>
            </el-col>
            <el-col class="GISMark" :span="1">Y</el-col>
            <el-col :span="7">
                <el-form-item>
                    <el-input v-model="form.x" placeholder="Y"></el-input>
                </el-form-item>
            </el-col>
            <el-col class="GISMark" :span="1">Z</el-col>
            <el-col :span="7">
                <el-form-item>
                    <el-input v-model="form.c" placeholder="Z"></el-input>
                </el-form-item>
            </el-col>
        </el-form-item>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                q: 0,
                w: 0,
                e: 0,
                a: 0,
                s: 0,
                d: 0,
                z: 1,
                x: 1,
                c: 1,
            }
        }
    },
}
</script>

<style lang="scss" scoped></style>