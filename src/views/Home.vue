<template>
  <div>
    <div class="split-container">
      <div class="split left">
        <presence />
        <div v-if="admin && flipState === 'waiting'">
          <button @click="flipTheCoin">Flip the coin</button>
        </div>
      </div>
      <div class="split">
        <matches />
      </div>
    </div>
    <chat v-if="enableChat" />
    <share-bar />
    <div class="modal" v-if="flipState === 'flipping'">
      <img class="coin" src="@/assets/coin.gif" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';
import Matches from '@/components/Matches.vue';
import RoundSettings from '@/components/RoundSettings.vue';
import ShareBar from '@/components/ShareBar.vue';
import Presence from '@/components/Presence.vue';
import Chat from '@/components/Chat.vue';

function shuffleArray(inputArray: any[]) {
  const array = inputArray;
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

@Component({
  components: {
    RoundSettings,
    Matches,
    ShareBar,
    Presence,
    Chat,
  },
  computed: {
    ...mapState(['roomHash', 'isRoomHashFresh', 'admin', 'matches', 'teamsPerMatch', 'flipState', 'enableChat']),
  },
})
export default class Home extends Vue {
  mounted() {
    if (!this.isRoomHashFresh) {
      this.$store.dispatch('loadGunData');
    } else {
      this.$router.push(`/admin/#${this.roomHash}`);
    }
  }

  flipTheCoin() {
    this.$store.commit('setFlipState', 'flipping');
    this.$gun
      .get(this.roomHash)
      .get('roomData')
      .get('flipState')
      .put('flipping');

    window.setTimeout(() => {
      this.$store.commit('setFlipState', 'flipped');
      this.$gun
        .get(this.roomHash)
        .get('roomData')
        .get('flipState')
        .put('flipped');

      if (this.teamsPerMatch === 2) {
        const newMatches = this.matches.map((match, i) => {
          const cointoss = Math.random().toFixed(0);
          const gov = match[cointoss];
          const opp = match[Math.abs(cointoss - 1)];

          this.$gun.get(this.roomHash)
            .get('roomData')
            .get('matches')
            .get(`match_${i}`)
            .get('team_0')
            .get('name')
            .put(gov);

          this.$gun.get(this.roomHash)
            .get('roomData')
            .get('matches')
            .get(`match_${i}`)
            .get('team_1')
            .get('name')
            .put(opp);

          return {
            0: gov,
            1: opp,
          };
        });

        this.$store.commit('setMatches', newMatches);
      } else if (this.teamsPerMatch === 4) {
        const newMatches = this.matches.map((match, i) => {
          const order = shuffleArray([0, 1, 2, 3]);
          const g1 = match[order[0]];
          const g2 = match[order[1]];
          const o1 = match[order[2]];
          const o2 = match[order[3]];

          this.$gun.get(this.roomHash)
            .get('roomData')
            .get('matches')
            .get(`match_${i}`)
            .get('team_0')
            .get('name')
            .put(g1);

          this.$gun.get(this.roomHash)
            .get('roomData')
            .get('matches')
            .get(`match_${i}`)
            .get('team_1')
            .get('name')
            .put(g2);

          this.$gun.get(this.roomHash)
            .get('roomData')
            .get('matches')
            .get(`match_${i}`)
            .get('team_2')
            .get('name')
            .put(o1);

          this.$gun.get(this.roomHash)
            .get('roomData')
            .get('matches')
            .get(`match_${i}`)
            .get('team_3')
            .get('name')
            .put(o2);

          return {
            0: g1,
            1: g2,
            2: o1,
            3: o2,
          };
        });

        this.$store.commit('setMatches', newMatches);
      }
    }, 3000);
  }
}
</script>

<style lang="scss">
.coin {
  margin: auto;
  display: block;
  margin-top: 250px;
  filter: brightness(0) invert(1);
  transform: rotate(90deg);
}
</style>
