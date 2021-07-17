<template>
  <div>
    <el-card shadow="always">
      <h3 style="line-height: 25px">Quên mật khẩu</h3>
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
            v-model="ruleForm.email"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button
            class="btn-submit-login"
            type="primary"
            @click="submitForm('ruleForm')"
            >Gửi xác nhận</el-button
          >
          <NuxtLink to="/login">Trở lại</NuxtLink>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  layout: "login",
  data() {
    return {
      ruleForm: {
        email: "",
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            type: "success",
            message: "Đã gửi mã xác nhận tới email :" + this.ruleForm.email,
          });
          this.$router.push("/login");
        } else {
          console.log("error submit!!");
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
.el-form-item {
  margin-bottom: 20px !important;
}
</style>