<template>
  <div>
    <el-card shadow="always">
      <h3 style="line-height: 25px">Đăng ký</h3>
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="form"
        class="demo-form"
      >
        <el-form-item>
          <el-input
            placeholder="User Name"
            v-model="form.name"
          ></el-input>
        </el-form-item>

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
            v-model="form.email"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="Nhập mật khẩu"
            v-model="form.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            type="password"
            placeholder="Nhập lại mật khẩu"
            v-model="form.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item style="margin-bottom: 10px">
          <el-button
            class="btn-submit-login"
            type="primary"
            @click="register('form')"
          >Đăng Ký
          </el-button>
          <NuxtLink to="/login" style="float: left">Trở lại đăng nhập</NuxtLink>
          <!--            <router-link to="/login">Trở lại đăng nhập</router-link>-->

        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  export default {
    layout: "login",
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("Vui lòng nhập mật khẩu"));
        } else if (value.length < 6) {
          callback(new Error("Mật khẩu ít nhất 6 ký tự"));
        } else {
          if (this.form.checkPass !== "") {
            this.$refs.form.validateField("checkPass");
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("Mật khẩu nhập lại không khớp"));
        } else if (value !== this.form.password) {
          callback(new Error("Mật khẩu nhập lại không khớp !"));
        } else {
          callback();
        }
      };
      return {
        form: {
          name: "",
          password: "",
          checkPass: "",
          email: "",
        },
        rules: {
          password: [{validator: validatePass, trigger: "blur"}],
          checkPass: [{validator: validatePass2, trigger: "blur"}],
        },
      };
    },
    methods: {
      async register(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            console.log(this.form);
            try {
              await this.$axios.post("/api/auth/register", {
                name: this.form.name,
                email: this.form.email,
                password: this.form.password,
              });
              this.$message({
                type: "success",
                message: "Đăng ký thành công email:" + this.form.email,
              });
              this.$router.push("/login");
            } catch (e) {
              this.error = e.response.data.message;
              this.$message({
                type: "error",
                message: "Dang ky that bai kiem tra lai !",
              });
            }
          } else {
            return false;
          }
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
</style>
