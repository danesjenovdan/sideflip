<template>
  <div class="share-bar">
    <div :class="['share-bar-split', { hidden: (flipState !== 'flipped') }]">
      <h1>This draw happened on {{ prettyFlipTime }}</h1>
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
    prettyFlipTime: {
      get() {
        if (this.flipTime) {
          return `${this.flipTime.toLocaleDateString()} at ${this.flipTime.toLocaleTimeString()}`;
        }
        return '';
      },
    },
  },
})
export default class ShareBar extends Vue {}
</script>

<style lang="scss">
.share-bar {
  position: relative;
  width: calc(100% - 40px);
  min-height: 170px;
  overflow: hidden;
  background: #ffffff;

  display: flex;

  padding: 20px;

  // background-image: linear-gradient(-62deg, #f2f6fa 0%, #dbe7f1 100%);
  background-image: linear-gradient(-62deg, #cee7fd 0%, #f7fafd 100%);

  z-index: 2;

  .share-bar-split {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: center;

    &:first-child {
      h1 {
        // line-height: 170px;
        // font-size: 24px;
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

  @media (max-width: 991px) {
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
