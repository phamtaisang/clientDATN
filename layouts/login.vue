<template>
  <div>
    <el-container>
      <el-main class="main-layout">
        <el-row>
          <el-col :lg="3"></el-col>
          <el-col :lg="13">
            <h1 style="line-height: 20px"><Logo /> FA</h1>
            <h5 style="line-height: 20px">
              FA giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống
              của bạn.
            </h5>
          </el-col>
          <el-col :lg="5"> <Nuxt /></el-col>
          <el-col :lg="3"></el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import Logo from "../components/Logo";
export default {
  // middleware: 'notAuthenticated',
  components: {
    Logo,
  },
};
</script>
<style>
.NuxtLogo {
  width: 30px;
}
</style>
