<template>
  <el-container>
    <el-row>
      <el-col :sm="24">
        <!-- <Story /> -->
        <CreatePost/>
        <ListPost/>
      </el-col>
    </el-row>
  </el-container>
</template>
<script>
  import CreatePost from "../components/home/post/CreatePost";
  import ListPost from "../components/home/post/ListPost";

  export default {
    // middleware: 'notAuthenticated',
    middleware: ['authenticated'],
    data() {
      return {
        visible: true,
      };
    },
    components: {
      CreatePost,
      ListPost,
    },
    methods: {}
  };
</script>
