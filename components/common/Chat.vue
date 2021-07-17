<template>
  <div class="box-chat d-none">
    <Chat
      v-if="visible"
      :participants="participants"
      :myself="myself"
      :messages="messages"
      :chat-title="chatTitle"
      :placeholder="placeholder"
      :colors="colors"
      :border-style="borderStyle"
      :hide-close-button="hideCloseButton"
      :close-button-icon-size="closeButtonIconSize"
      :submit-icon-size="submitIconSize"
      :async-mode="asyncMode"
      :scroll-bottom="scrollBottom"
      :display-header="true"
      :send-images="true"
      :profile-picture-config="profilePictureConfig"
      :timestamp-config="timestampConfig"
      :accept-image-types="'.png, .jpeg'"
      @onType="onType"
      @onClose="onClose"
      @onMessageSubmit="onMessageSubmit"
    />
  </div>
</template>

<script>
import { Chat } from "vue-quick-chat";
import "vue-quick-chat/dist/vue-quick-chat.css";
import { mapGetters } from "vuex";
export default {
  components: {
    Chat,
  },
  data() {
    return {
      visible: true,
      participants: [{
            name: 'Văn Cương',
            id: 1,
            profilePicture: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/NafSadh_Profile.jpg/768px-NafSadh_Profile.jpg'
        },
        {
            name: 'Xuân Toản',
            id: 2,
            profilePicture: 'https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg'
        }
    ],
    myself: {
        name: 'SangPT',
        id: 3,
        profilePicture: 'https://lh3.googleusercontent.com/ogw/ADGmqu-Gy8CqpSuvmtte9evH-DJ9-lowo3E78ld-0flMJw=s83-c-mo'
    },
    messages: [{
            content: 'hi',
            myself: false,
            participantId: 1,
            timestamp: { year: 2019, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123 },
            type: 'text'
        },
        {
            content: '123',
            myself: true,
            participantId: 3,
            timestamp: { year: 2019, month: 4, day: 5, hour: 19, minute: 10, second: 3, millisecond: 123 },
            type: 'text'
        },
        {
            content: 'gg',
            myself: false,
            participantId: 2,
            timestamp: { year: 2019, month: 5, day: 5, hour: 10, minute: 10, second: 3, millisecond: 123 },
            type: 'text'
        }
    ],
    chatTitle: 'Group Chat',
      placeholder: "Gửi tin nhắn của bạn",
      colors: {
        header: {
          bg: "#d30303",
          text: "#fff",
        },
        message: {
          myself: {
            bg: "#fff",
            text: "#bdb8b8",
          },
          others: {
            bg: "#fb4141",
            text: "#fff",
          },
          messagesDisplay: {
            bg: "#f7f3f3",
          },
        },
        submitIcon: "#b91010",
        submitImageIcon: "#b91010",
      },
      borderStyle: {
        topLeft: "10px",
        topRight: "10px",
        bottomLeft: "10px",
        bottomRight: "10px",
      },
      hideCloseButton: false,
      submitIconSize: 25,
      closeButtonIconSize: "20px",
      asyncMode: false,

      scrollBottom: {
        messageSent: true,
        messageReceived: false,
      },
      displayHeader: true,
      profilePictureConfig: {
        others: true,
        myself: true,
        styles: {
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        },
      },
      timestampConfig: {
        format: "HH:mm",
        relative: false,
      },
    };
  },
  // computed: mapGetters({
  //   participants: "chat/getParticipants",
  //   myself: "chat/getMyself",
  //   messages: "chat/getMessages",
  //   chatTitle: "chat/getChatTitle",
  // }),
  mounted() {
  },
  methods: {
    onType() {
      console.log("đang nhập");
    },
    onClose() {
      this.visible = false;
      console.log("heheh");
    },
    onMessageSubmit(message) {
      console.log(message);
    },
  },
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 300px;
}

.quick-chat-container .container-message-display {
  max-height: 400px;
}
</style>