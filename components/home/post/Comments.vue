<template>
  <div>
    <el-col :lg="24"><el-link v-if="comments.length > 3 && showFull == false" @click="showFull=true">Xem thêm {{comments.length - commentCompact.length}} bình luận khác</el-link></el-col>
    <el-col :lg="24" class="list-comment border-comment" v-for="(comment, index) in comments" :key="index" v-if="showFull">
      <el-tag type="info" class="comment_tag">
        <NuxtLink :to="'/profile/'+comment[1].user_id">{{ comment[1].user_name }}</NuxtLink> :
        <el-link type="info" :underline="false">{{comment[1].content}}</el-link>
        <el-dropdown trigger="click">
          <button style="border: none;padding:0;background: none;" class="el-dropdown-link"><i class="el-icon-more-outline"></i></button>
          <el-dropdown-menu slot="dropdown">
            <!--<el-dropdown-item><i class="el-icon-edit"></i> Edit</el-dropdown-item>-->
            <el-dropdown-item><el-link :underline="false" @click="deleteComment(comment[0])"><i class="el-icon-delete"></i> Xóa </el-link></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-tag>
    </el-col>
    <el-col :lg="24" class="list-comment border-comment" v-for="(comment, index) in commentCompact" :key="index" v-if="!showFull">
      <el-tag type="info" class="comment_tag">
        <NuxtLink :to="'/profile/'+comment[1].user_id">{{ comment[1].user_name }}</NuxtLink> :
        <el-link type="info" :underline="false">{{comment[1].content}}</el-link>
        <el-dropdown trigger="click">
          <button style="border: none;padding:0;background: none;" class="el-dropdown-link"><i class="el-icon-more-outline"></i></button>
          <el-dropdown-menu slot="dropdown">
            <!--<el-dropdown-item><i class="el-icon-edit"></i> Edit</el-dropdown-item>-->
            <el-dropdown-item><el-link :underline="false" @click="deleteComment(comment[0])"><i class="el-icon-delete"></i>  Xóa </el-link></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-tag>
    </el-col>
    <el-col :lg="24" class="text-lg-center input-comment">
      <i
        @click="showIcon()"
        class="icon_comment hu5pjgll bixrwtb6 sp_MOgjR2grmN0 sx_48b668"
      ></i>
      <el-row class="form-comment">
        <el-input
          @keyup.enter.native="createComment()"
          placeholder="Thêm bình luận . . ."
          v-model="text_comment"
          @focus="iconVisible = false"
        >
          <el-button slot="append" style="transform: translateX(31px);"><span style="color:#0095f6;" @click="createComment()">Đăng</span></el-button>
        </el-input>
        <VEmojiPicker @input="text_comment" @select="selectEmoji" v-if="iconVisible" />
      </el-row>
    </el-col>
  </div>
</template>
<script>
  import { VEmojiPicker } from "v-emoji-picker";
  import { mapActions, mapGetters } from "vuex";

  import * as firebase from "firebase/app";
  import "firebase/database";

  export default {
    props: {
      propsPostId: ""
    },
      data () {
      return {
        iconVisible: false,
        text_comment: "",
        comments: [],
        commentCompact: [],
        showFull: false
      }
    },
    components: {
      VEmojiPicker,
    },
    mounted() {
      // https://firebase.google.com/docs/reference/js/firebase.database.Reference#key
      var that = this;
      var rootRef = firebase.database().ref("comments/posts/"+this.propsPostId);
      rootRef.on("value", function(snapshot) {
        if(snapshot.val()) {
          that.comments = Object.entries(snapshot.val());
          that.commentCompact = Object.entries(snapshot.val()).slice(-3);
        }
      }, function (error) {
        console.log("Error: " + error.code);
      });
    },
    methods: {
      ...mapActions({
        add: "comments/createComment",
        delete: "comments/deleteComment",
      }),
      showIcon() {
        this.iconVisible = !this.iconVisible;
      },
      selectEmoji(emoji) {
        this.text_comment += emoji.data;
      },
      async createComment() {
        try {
          let {isSuccess} = await this.add({
            data: {
              post_id: this.propsPostId,
              message: this.text_comment,
            },
          });
          if (isSuccess) {
            this.$message.success("Bạn vừa bình luận 1 bài viết")
            this.text_comment = "";
          }
        }
          catch (e) {
          alert(e)
        }
      },
      async deleteComment(comment_id) {
        console.log(comment_id)
        try {
          let {isSuccess} = await this.delete({
            data: {
              post_id: this.propsPostId,
              comment_id: comment_id,
            },
          });
          if (isSuccess) {
            this.$message.success("Bạn đã xóa 1 bình luận !")
            this.text_comment = "";
          }
        }
        catch (e) {
          alert(e)
        }
      }
    }
  }
</script>
