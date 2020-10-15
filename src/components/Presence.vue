<template>
  <div class="presence">
    <h1>Present</h1>
    <div class="avatars-container">
      <avatar
        class="avatar"
        v-for="person in present"
        :key="person"
        :name="person"
      />
    </div>
    <div class="modal" v-if="!signedIn">
      <div class="modal-inner">
        <h1>Please enter your nickname</h1>
        <input type="text" v-model="userName" @keyup.enter="join">
        <button v-if="admin" @click="join">Enter the draw</button>
        <button v-else @click="join">Watch the draw</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';
import Avatar from './Avatar.vue';

@Component({
  components: {
    Avatar,
  },
  computed: {
    ...mapState(['roomHash', 'present', 'userName', 'signedIn', 'admin']),
    userName: {
      get() {
        return this.$store.state.userName;
      },
      set(newUserName) {
        this.$store.commit('setUserName', newUserName);
      },
    },
  },
})
export default class Presence extends Vue {
  join() {
    if (this.userName !== '') {
      const now = new Date();
      this.$gun
        .get(this.roomHash)
        .get('roomData')
        .get('present')
        .get(this.userName)
        .put(now.getTime());

      this.$store.commit('setSignedIn', true);
    } else {
      alert('Please choose a name for yourself.');
    }
  }

  mounted() {
    // if (this.admin) {
    //   this.userName = 'admin';
    //   this.join();
    // }

    window.setInterval(() => {
      const now = new Date();
      this.$gun
        .get(this.roomHash)
        .get('roomData')
        .get('present')
        .get(this.userName)
        .put(now.getTime());
    }, 10000);
  }
}
</script>

<style lang="scss">
.modal {
  input {
    width: calc(100% - 24px);
  }
}
</style>
