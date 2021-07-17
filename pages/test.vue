<template>
    <div style="margin-top:50px;">
        <div v-for="o in 4" :key="o" class="text item">
            {{'List item ' + o }}
        </div>
        <form  @submit.prevent="submit()">
            <el-input
                type="input"
                :rows="1"
                placeholder="Nhập nội dung . . ."
                v-model="content">
            </el-input>
        </form>
      <el-input
        @keyup.enter.native="sendMessage()"
        placeholder="Thêm bình luận . . ."
        v-model="txt_message" />
    </div>
</template>
<script>
export default {
    data() {
        return {
        title: 'Sangpt',
          txt_message: '',
        content: ''
        }
    },
     mounted() {
    //Socket nhận data và append vào giao diện
       try {
            var socket = io.connect('http://localhost:4000');
            this.socket = socket
            var that = this
            socket.on('connect', function(data) {
                socket.on('send', function (msg) {
                    console.log("em"+msg);
                    that.message_text(msg);
                });
            });
        }
        catch(err) {
            alert('ERROR: socket.io encountered a problem:\n\n' + err);
        }
    },
    methods: {
        message_text(content = null) {
            this.$notify({
                title: this.title,
                message: content ? content : this.content,
                type: 'success',
                position: 'bottom-right'
            });
      },
        submit() {
             console.log(this.content);
        },
      sendMessage() {
        console.log(this.txt_message)
      }
    }
}
</script>
