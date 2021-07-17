<template>
  <div>
    <el-card shadow="always" class="create-post">
      <el-row :gutter="20" style="margin: 20px 0" v-if="formPost">
        <el-col :span="4" :xs="4">
          <el-avatar
            style="margin-top: -7px"
            :size="50"
            :src="user.avatar"
          ></el-avatar>
        </el-col>
        <el-col :span="20" :xs="20">
          <el-button
            @click="createPost()"
            style="width: 100%; border: none; padding: 0"
          >
            <el-input
              placeholder="Tạo một bài viết !"
              v-on:keyup="createPost()"
              suffix-icon="el-icon-edit"
              v-model="input"
            >
            </el-input>
          </el-button>
        </el-col>
      </el-row>
<!--      <el-row :gutter="20" class="row-posts" style="margin-bottom: 20px">-->
<!--        <el-col :span="8">-->
<!--          <i class="el-icon-picture" @click="createPost()"></i>-->
<!--          <span class="title" @click="createPost()">Photo/Video</span>-->
<!--        </el-col>-->
<!--      </el-row>-->
    </el-card>
    <el-dialog
      :visible.sync="onFormPost"
      width="80%"
      :before-close="handleClose"
      :title="this.formPost.isCreate ? 'Tạo 1 bài đăng mới' : 'Sửa bài viết'"
      class="dialog-create"
    >
      <el-row>
        <el-col :lg="2" :sm="2" :xs="2">
          <el-avatar
            style=""
            :size="30"
            :src="user.avatar"
          ></el-avatar>
        </el-col>
        <el-col :span="6" style="text-align: left; text-indent: 18px">
          <b>{{ user && user.name }}</b>
          <el-select
            v-model="value"
            placeholder="Select"
            class="select-create-posts"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 6 }"
        suffix-icon="el-icon-edit"
        :placeholder="'What is on your mind,'+ user.name "
        v-model="title"
        @focus="iconVisible = false"
      >
      </el-input>
      <client-only placeholder="loading...">
        <ckeditor-nuxt v-model="description" :config="editorConfig"  />
      </client-only>
      <i
        @click="showIcon()"
        class="hu5pjgll bixrwtb6 sp_MOgjR2grmN0 sx_48b668"
      ></i>
      <VEmojiPicker  @select="selectEmoji" v-if="iconVisible" />
      <el-upload
        class="upload-demo"
        ref="upload"
        :auto-upload="false"
        :limit="3"
        :on-change="handleChange"
        :file-list="fileList"
        list-type="picture-card"
        name="images"
        action=""
      >
        <i class="el-icon-picture"></i>
        <span class="title">Photo/Video</span>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onFormPostAC()">Đóng</el-button>
        <el-button type="primary" @click="submitUpload()">{{this.formPost.isCreate ? 'Đăng bài' : 'Cập nhật'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { VEmojiPicker } from "v-emoji-picker";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    'ckeditor-nuxt': () => { if (process.client) { return import('@blowstack/ckeditor-nuxt') } },
    VEmojiPicker,
  },
  data() {
    return {
      iconVisible: false,
      formPost: {
        postImage: [],
        },
      title:"",
      fileList: [],
      input: "",
      options: [
        {
          value: "Public",
          label: "Public",
        },
        {
          value: "Friends",
          label: "Friends",
        },
      ],
      value: "public",
      editorConfig: {
        simpleUpload: {
          uploadUrl: 'path_to_image_controller',
          headers: {
            'Authorization': 'optional_token'
          }
        }
      },
      description: ""
    };
  },
  computed: {
    ...mapGetters({
      user :"loggedInUser",
      onFormPost: "post/onFormPost",
      post: "post/getPost",

    })
  },
  watch: {
    post(value) {
      this.formPost = Object.assign({}, value);
      this.title = value.title;
      if (!this.formPost.isCreate) {
        for (const image of value.postImage) {
          this.fileList.push({url: image});
        }
      }
    }
  },
  methods: {
    ...mapActions({
      add: "post/createPost",
      edit: "post/editPost",
      onFormPostAC: "post/onFormPost",
      emptyForm: "post/emptyForm"
    }),
    handleChange(file, fileList) {
      this.formPost.postImage = fileList.slice(-3);
    },
    showIcon() {
      this.iconVisible = !this.iconVisible;
    },
    async submitUpload() {
      try {
          if (this.formPost.isCreate) {
            let {isSuccess} = await this.add({
              data: {
                post_title: this.title,
                post_description: this.description,
                images: this.formPost.postImage,
              },
            });
            if (isSuccess) {
              this.onFormPostAC();
              this.$message.success("Đã tạo mới thành công 1 bài viết !")
              // this.$store.dispatch("post/loadData");
            }
          }
          else {
            let {isSuccess} = await this.edit({
              id: this.formPost.id,
              data: {
                post_title: this.title,
                images: this.formPost.postImage,
              },
            });
            if (isSuccess) {
              this.onFormPostAC();
              this.$message.success("Sửa bài viết thành công !")
              this.$store.dispatch("post/loadData");
            }
          }
      } catch (e) {
        this.$message.error('Thất bại')
      }
    },
    createPost() {
      this.emptyForm();
      this.fileList = [];
      this.onFormPostAC();
    },
    handleClose(done) {
      this.$confirm("Bạn có chắc chắn muốn đóng !")
        .then((_) => {
          done();
          this.onFormPostAC();
        })
        .catch((_) => {});
    },
    selectEmoji(emoji) {
      this.title += emoji.data;
    },
  },
};
</script>
