<template>
  <div>
    <div class="split-container">
      <div class="split left">
        <round-settings
          :roomName="roomName"
          :enableChat="enableChat"
          :flipType="flipType"
          :numberOfMatches="numberOfMatches"
          :roomHash="roomHash"
          :teamsPerMatch="teamsPerMatch"
        />
      </div>
      <div class="split hidden-xs">
        <matches />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';
import Matches from '@/components/Matches.vue';
import RoundSettings from '@/components/RoundSettings.vue';

@Component({
  components: {
    RoundSettings,
    Matches,
  },
  computed: {
    ...mapState(['roomHash', 'isRoomHashFresh']),
  },
})
export default class Admin extends Vue {
  private roomName: string;

  private flipType: string;

  private teamsPerMatch: number;

  private numberOfMatches: number;

  private enableChat: boolean;

  constructor() {
    super();
    this.roomName = '';
    this.flipType = 'determine';
    this.teamsPerMatch = 2;
    this.numberOfMatches = 1;
    this.enableChat = false;
  }

  mounted() {
    if (!this.isRoomHashFresh) {
      this.$store.dispatch('loadGunData');
    }
  }
}
</script>

<style lang="scss">
</style>
