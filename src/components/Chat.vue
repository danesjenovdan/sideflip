<template>
  <div class="chat-container">
    <h1>Chat</h1>
    <div class="messages-container" ref="messagesContainer">
      <div
        v-for="message in messages"
        :key="message.msgId"
        :class="['message-container', {self: (message.user === userName)}]"
      >
        <div class="chat-user">
          {{message.user}}
        </div>
        <div class="chat-message">
          {{ message.msg }}
        </div>
      </div>
    </div>
    <input id="message" type="text" @keyup.enter="handleNewMessage" v-model="currentMessage" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';

@Component({
  computed: {
    ...mapState(['userName', 'roomHash']),
  },
})
export default class Chat extends Vue {
  private messages: object;

  private currentMessage: string;

  constructor() {
    super();
    this.messages = {};
    this.currentMessage = '';
  }

  handleNewMessage() {
    const msg = this.currentMessage;
    const now = new Date().getTime();
    const message = {
      msg,
      user: this.userName,
      time: now,
    };

    this.$gun.get(this.roomHash).get('chat').set(message);
    this.scrollChat();
    this.currentMessage = '';
  }

  scrollChat() {
    // const { messagesContainer } = this.$refs;
    this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
  }

  mounted() {
    this.$gun.get(this.roomHash)
      .get('chat')
      .map()
      .on((val, msgId) => {
        if (val) {
          Vue.set(this.messages, msgId, { msgId, ...val });
          // this.messages[msgId] = { msgId, ...val };
        } else {
          // null messages are deleted
          delete this.messages[msgId];
        }
        this.$nextTick(() => {
          this.scrollChat();
        });
      });
  }
}
</script>

<style lang="scss">
.chat-container {
  width: 100%;
  max-width: 400px;
  margin: auto;

  margin-bottom: 40px;

  overflow: hidden;

  display: block;

  #message {
    width: 100%;
  }

  .messages-container {
    max-width: 400px;
    height: 200px;
    background: #ffffff;
    margin: auto;
    overflow-y: auto;

    border: 2px solid #3098f3;
    border-bottom: none;

    padding: 20px;

    .message-container {
      width: 100%;
      display: block;
      position: relative;
      float: left;
      margin-bottom: 10px;

      .chat-user {
        font-size: 10px;
        text-align: left;
        width: 100%;
        padding-bottom: 4px;
      }

      .chat-message {
        background-color: #dbe7f1;
        padding: 10px;
        border-radius: 30px 30px 30px 0;
        width: auto;
        display: block;
        float: left;
        position: relative;
        max-width: 200px;
      }

      &.self {
        .chat-message {
          background-color: #f5f2e8;
          border-radius: 30px 30px 0 30px;
          float: right;
        }

        .chat-user {
          text-align: right;
        }
      }
    }
  }

  #message {
    width: calc(100% - 28px);
  }
}
</style>
