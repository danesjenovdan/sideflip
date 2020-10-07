<template>
  <div class="share-bar">
    <div class="">
      <h1>Use this link to invite participants</h1>
      <input type="url" :value="`https://djnd.si/sideflip/#${roomHash}`">
    </div>
    <div class="" v-if="admin">
      <h1>Use this link to enter as draw master</h1>
      <input type="url" :value="`https://djnd.si/sideflip/admin/#${roomHash}`">
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  computed: {
    ...mapState(['roomHash', 'admin']),
  },
})
export default class ShareBar extends Vue {}
</script>

<style lang="scss">
.share-bar {
  position: relative;
  width: calc(100% - 40px);
  height: 170px;
  overflow: hidden;
  background: #ffffff;

  display: flex;

  padding: 20px;

  background-image: linear-gradient(-62deg, #f2f6fa 0%, #dbe7f1 100%);

  z-index: 2;

  h1 {
    margin-top: 0;
    width: 100%;
  }

  input {
    width: 90%;
  }

  @media (max-width: 767px) {
    flex-wrap: wrap;
    height: 320px;

    div {
      width: 100%;
    }
  }
}
</style>
