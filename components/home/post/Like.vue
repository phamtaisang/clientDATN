<template>
 <div>
   <el-col :lg="8" class="border-comment">
     <el-link @click="updateLike(post.id)" :underline="false">
       <svg
         :aria-label="post.be_liked ? 'Tim' : 'Bỏ tim'"
         class="_8-yf5"
         :fill="post.be_liked ? '#ed4956' : '#262626'"
         height="35"
         viewBox="0 0 48 48"
       >
         <path
           :d="post.be_liked ? 'M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z'
                      : 'M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z'
                      "
         ></path>
       </svg>
       <!--<span class="number-like" :style="post.be_liked ? 'color:white;' : 'color:black;'"> {{ post.like.length }} </span>-->
     </el-link>
     <el-link class="friend-liked" type="default" :underline="false" @click="dialogVisible = true">{{ post.like.length }}
       Lượt thích
     </el-link>

     <el-dialog
       title="Lượt thích"
       :visible.sync="dialogVisible"
       width="30%" class="list-liked">
     <el-row>
       <el-col :xs="24" v-for="(value, index) in post.like" :key="index">
          <div class="item">
            <NuxtLink :to="'/profile/'+post.user.id">
              <el-avatar icon="el-icon-user-solid" :url="value.user.avatar"></el-avatar>
            </NuxtLink>
            <el-link :underline="false" style="transform: translateY(-17px); font-weight: bold;">
              <NuxtLink :to="'/profile/'+post.user.id">{{value.user.name}}</NuxtLink>
            </el-link>
            <NuxtLink :to="'/profile/'+post.user.id">
              <el-button type="primary" round style="float: right;transform: translateY(6px);">
                Bạn bè
              </el-button>
            </NuxtLink>
          </div>
       </el-col>
     </el-row>
     </el-dialog>

   </el-col>
 </div>
</template>
<script>
  import {mapActions, mapGetters} from "vuex";

  export default {
    props: {
      post: {},
    },
    data() {
      return {
        dialogVisible: false
      }
    },
    mounted() {
    },
    computed: mapGetters({
      user: "loggedInUser",
    }),
    methods: {
      ...mapActions({
        like: "post/likeAction"
      }),
      async updateLike(post_id) {
        try {
            await this.like({
            user_id: this.user.id,
            data: {post_id: post_id}
          });
          this.$store.dispatch("post/loadData");
        } catch (e) {
          this.$message.error('Thất bại')
        }
      },
    }
  }
</script>
