<template>
  <div class="share-bar">
    <div :class="['share-bar-split', { hidden: (flipState !== 'flipped') }]">
      <h1>This draw happened on {{ flipTime }}</h1>
    </div>
    <div class="share-bar-split">
      <h1>Use this link to invite participants</h1>
      <input type="url" :value="`https://djnd.si/sideflip/#${roomHash}`">
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  computed: {
    ...mapState(['roomHash', 'admin', 'flipState', 'flipTime']),
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

  .share-bar-split {
    width: 100%;

    &:first-child {
      h1 {
        line-height: 170px;
        &::before {
          display: none;
        }
      }
    }

    &.hidden {
      display: none !important;
    }
  }

  h1 {
    margin-top: 0;
    // width: 100%;
  }

  input {
    width: 90%;
  }

  @media (max-width: 767px) {
    flex-wrap: wrap;
    height: 320px;

    .share-bar-split {
      &:first-child {
        h1 {
          line-height: 40px;
        }
      }
    }

    div {
      width: 100%;
    }
  }
}
</style>
