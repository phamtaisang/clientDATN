<template>
  <el-menu class="menu-right d-none" style="text-align: left">
    <el-menu-item>
      <img
        src="https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/S0U5ECzYUSu.png"
        alt="banbe"
      />
      <span class="title-menu-left">Bạn bè</span>
    </el-menu-item>
    <el-menu-item
      v-for="(value, index) in users"
      :key="index"
    >
      <NuxtLink :to="'/profile/'+value.id">
        <el-badge is-dot class="item">
          <el-avatar icon="el-icon-user-solid"></el-avatar>
        </el-badge>
        <span class="title-span">{{ value.name }}</span>
      </NuxtLink>
    </el-menu-item>

    <Chat v-if="visible"/>
  </el-menu>
</template>

<script>
import Chat from "../Chat";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      visible: false,
      user: {},
    };
  },
  computed: mapGetters({
    users: "post/getUsers",
  }),
  components: {
    Chat,
  },
  methods: {
    showChatPops(user) {
      this.visible = true;
    },
    // hideChatPops(msg) {
    //   this.visible = msg;
    // },
  },
};
</script>

<style>
span.title-span {
  padding-left: 10px;
}
.el-badge__content.el-badge__content--undefined.is-fixed.is-dot {
  background-color: #67c23a !important;
}
</style>
