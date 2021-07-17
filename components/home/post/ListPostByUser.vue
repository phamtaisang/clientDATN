<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="(post, index) in posts"
        :key="index"
        :timestamp="post.created_at"
        placement="top"
      >
        <el-card class="post">
          <NuxtLink :to="'/profile/'+post.user.id">
            <el-avatar
              style="transform: translateY(8px)"
              :size="25"
              :src="post.user.avatar"
            ></el-avatar>
          </NuxtLink>
          <NuxtLink :to="'/profile/'+post.user.id" class="customer-posts">{{ post.user.name }}</NuxtLink>
          <span style="font-size: 12px;color: #999;">đã đăng bài viết</span>
          <NuxtLink :to="{ path: '/post/' + post.title, query: { slug: post.id }}">
            <p style="line-height: 35px; text-align: justify">
              {{ post.title }}
            </p>
          </NuxtLink>
          <!--            <NuxtLink :to="{ path: '/post/' + post.title, query: { slug: post.id }}">-->
          <!--              <p style="line-height: 35px; text-align: justify">-->
          <!--                <span v-html="post.description"></span>-->
          <!--              </p>-->
          <!--            </NuxtLink>-->
          <p>
            <el-link v-if="post.trip">
              <NuxtLink :to="'/map/trip-detail/'+post.trip.id">
                <i class="el-icon-location-information"></i>
                {{ post.trip.title }}
                <span>từ ngày {{ post.trip.time_start }} đến {{ post.trip.time_end }}</span>
              </NuxtLink>

            </el-link>
          </p>
          <p v-if="user.id == post.user.id && !post.trip">
            Bạn chưa tạo lịch trình cho bài đăng này  !!
            <el-button type="text" @click="createTrip(post.id)">Tạo ngay</el-button>
          </p>
          <el-dropdown class="dropdown-posts" trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-more-outline el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" v-if="user.id == post.user.id">
              <el-dropdown-item>
                <el-link :underline="false" @click="getPost(post.id)"><i class="el-icon-edit"></i>Sửa bài viết</el-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-link :underline="false" @click="deletePost(post.id)"><i class="el-icon-delete"></i>Xóa bài viết</el-link>
              </el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu slot="dropdown" v-else>
              <el-dropdown-item>
                <el-link :underline="false"><i class="el-icon-location-information"></i>Găn bài viết vào lịch trình đã tạo</el-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-link :underline="false"><i class="el-icon-close-notification"></i>Tắt thông báo cho bài viết</el-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-image
            v-for="(value, index) in post.postImage"
            :style="index == 0 ? 'width: 100%;' : ''"
            :class="index !== 0 &&  post.postImage.length > 3 ? 'images-posts-small' : 'images-posts'"
            :key="index"
            :src="value"
            :preview-src-list="post.postImage"
          ></el-image>
          <div class="count-image" v-if="index !== 0 &&  post.postImage.length > 2">
            + {{ post.postImage.length - 1 }}
          </div>
          <el-row>
            <Like :post="post" />
            <Comments :propsPostId='post.id' />
          </el-row>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";
  import Comments from "./Comments";
  import Like from "./Like";
  export default {
    data() {
      return {
        loading: false,
        posts: [],
      };
    },
    components: {
      Comments,
      Like
    },
    mounted() {
      this.ActionGetPostByUserId(this.$route.params.detail)
    },
    created() {
    // dispatch loading
    },
    computed: mapGetters({
      getPosts: "post/getPostByUser",
      user: "loggedInUser",
    }),
    watch: {
      getPosts(value) {
        this.posts = Object.assign({}, value);
      }
    },
    methods: {
      ...mapActions({
        delete: "post/deletePost",
        getPostById: "post/getPostById",
        ActionGetPostByUserId: "post/getPostByUser"
      }),
      submit(user, post_id) {
        this.add({
          data: {
            user: user.id,
            content: this.text_comment,
            post: post_id,
          },
        });
      },
      async getPost(post_id) {
        try {
          await this.getPostById(post_id);
        } catch (e) {
          this.$message.error('Thất bại')
        }
      },
      async deletePost(post_id) {
        try {
          let {isSuccess} = await this.delete(post_id);
          if (isSuccess) {
            this.$message.success("Đã xóa thành công !")
            // this.$store.dispatch("post/loadData");
          }
        } catch (e) {
          this.$message.error('Thất bại')
        }
      },
    },
  };
</script>
