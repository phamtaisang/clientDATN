<template>
  <div>
    <el-card shadow="always">
      <h3 style="line-height: 25px">Đăng nhập</h3>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item
          prop="email"
          :rules="[
            {
              required: true,
              message: 'Nhập đúng định dạng email',
              trigger: 'blur',
            },
            {
              type: 'email',
              message: 'Nhập đúng định dạng email',
              trigger: ['blur', 'change'],
            },
          ]"
        >
          <el-input
            placeholder="Email hoặc số điện thoại"
            name="email"
            v-model="ruleForm.email"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="email"
          :rules="[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu !',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            placeholder="Mật khẩu"
            type="password"
            name="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button
            class="btn-submit-login"
            type="primary"
            @click="submitForm('ruleForm')"
          >Đăng nhập
          </el-button
          >
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-button-->
        <!--            class="login-google"-->
        <!--            @click="submitGoogle()"-->
        <!--            type="danger"-->
        <!--            style="width: 100%"-->
        <!--          >-->
        <!--            Đăng nhập bằng google-->
        <!--          </el-button>-->
        <!--        </el-form-item>-->
        <el-form-item style="margin-bottom: 0">
          <NuxtLink to="/forgot-password">Quên mật khẩu ?</NuxtLink>
        </el-form-item>
        <el-form-item>
          <NuxtLink to="/register">
            <el-button class="register" type="primary">
              Tạo tài khoản mới
            </el-button>
          </NuxtLink>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  const Cookie = process.client ? require("js-cookie") : undefined;
  import * as firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/database";

  export default {
    // middleware: "notAuthenticated",
    layout: "login",
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("Vui lòng nhập mật khẩu"));
        } else {
          if (this.ruleForm.checkPass !== "") {
            this.$refs.ruleForm.validateField("checkPass");
          }
          callback();
        }
      };
      return {
        ruleForm: {
          pass: "",
          email: "",
        },
        rules: {
          pass: [{validator: validatePass, trigger: "blur"}],
        },
      };
    },
    methods: {
      submitForm(formName) {
        setTimeout(() => {
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              try {
                let response = await this.$auth.loginWith("local", {
                  data: {
                    email: this.ruleForm.email,
                    password: this.ruleForm.pass,
                  },
                });
                // we simulate the async request with timeout.
                const auth = {
                  accessToken: this.$auth.$storage._state['_token.local'],
                  user: this.$auth.user,
                };
                this.$store.commit("setAuth", auth); // mutating to store for client rendering
                Cookie.set("auth", auth); // saving token in cookie for server rendering
                this.$router.push("/");
              } catch (e) {
                this.$message({
                  type: "error",
                  message: "Email hoặc mật khẩu không đúng !",
                });
              }
            } else {
              console.log("error submit!!");
              return false;
            }
          });
        }, 1000);
      },
      submitGoogle() {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (e) {
          console.log(e)
        });
      },
    },
  };
</script>
<style>
  .btn-submit-login {
    width: 100%;
  }

  .el-input__inner {
    border-radius: 5px;
  }

  .register {
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
    width: 70% !important;
  }

  .register span a {
    text-decoration: none;
    color: white;
  }

  .el-form-item__content a {
    text-decoration: none;
    color: #409eff;
  }
</style>
