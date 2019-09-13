<template>
    <div style="margin-top:15%; margin-left:40%;">
        <el-form ref="form" :model="form" label-width="80px">
            <el-row>
                <el-col :span="7">
                    <el-form-item label="用户名">
                        <el-input v-model="form.name" type="text"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="7">
                    <el-form-item label="密　码">
                        <el-input v-model="form.password" type="password"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3" :offset="3" class="center">
                    <el-button type="primary" style="width:100%" @click="login">登录</el-button>
                    <span class="red" v-if="isShow">{{infoShow}}</span>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    name: 'admin',
                    password: 'admin'
                },
                infoShow: '账号密码错误！',
                isShow: false
            }
        },
        methods: {
            login() {
                if (this.form.name === "admin" && this.form.password === "admin") {
                    this.$router.push({path: '/index'});
                } else {
                    this.isShow = true;
                    this.form.name = this.form.password = "admin";
                }
            }
        }
    }
</script>

<style scoped>
    .red {
        color: red;
        font-size: 14px;
    }

    .center {
        text-align: center;
    }
</style>