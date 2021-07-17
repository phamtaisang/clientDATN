<template>
  <div>
    <el-container>
      <Header />
    </el-container>
    <el-container>
      <el-main class="main-layout">
        <el-row style="padding-top: 50px;">
          <el-col :lg="4" :sm="24" style="margin: 50px auto; margin-top: 0">
            <MenuLeft />
          </el-col>
          <el-col :lg="9" :sm="24">
            <Nuxt />
          </el-col>
          <el-col :lg="3" :sm="24">
          </el-col>
          <el-col :lg="6" :sm="24">
            <ListUsersActive />
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import Header from "../components/common/header/Header";
import MenuLeft from "../components/common/menu/Left";
import ListUsersActive from "../components/common/menu/ListFriends";

export default {
  middleware: 'authenticated',
  components: {
    Header,
    MenuLeft,
    ListUsersActive,
  },
};
</script>
