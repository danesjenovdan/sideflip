<template>
  <div class="matches-container">
    <p v-if="!(numberOfMatches > 0) || !teamsPerMatch" class="intro">
      <strong>Greetings Draw Master!</strong> Here are some words for you.
    </p>
    <div v-else>
      <h1>Teams</h1>
      <div v-if="teamsPerMatch" :class="['match-container', {four: (teamsPerMatch === 4)}]">
        <div class="team-heading"></div>
        <div
          v-for="(team, teamIndex) in teamsPerMatch"
          :key="`teamHeading_${teamIndex}`"
          :class="['team-heading', flipState, 'hidden-xs']"
        >
          <span v-if="flipState !== 'flipped'">Team {{ teamIndex + 1 }}</span>
          <span v-else-if="teamsPerMatch === 2">
            {{ teamIndex === 0 ? 'PROPOSITION' : 'OPPOSITION' }}
          </span>
          <span v-else>{{ ['1G', '1O', '2G', '2O'][teamIndex] }}</span>
        </div>
      </div>
      <div
        v-for="(match, matchIndex) in matches"
        :key="`match_${matchIndex}`"
        :class="['match-container', {four: (teamsPerMatch === 4)}]"
      >
        <div class="team-heading">Match {{ matchIndex + 1 }}</div>
        <div
          :class="['team-heading', 'light', flipState]"
          v-for="(team, teamIndex) in teamsPerMatch"
          :key="`team_${teamIndex}`"
        >
          <span v-if="flipState !== 'flipped'" class="visible-xs">Team {{ teamIndex + 1 }}</span>
          <span v-else-if="teamsPerMatch === 2" class="visible-xs">
            {{ teamIndex === 0 ? 'PROPOSITION' : 'OPPOSITION' }}
          </span>
          <span v-else class="visible-xs">{{ ['1G', '1O', '2G', '2O'][teamIndex] }}</span>
          <input
            type="text"
            :id="`m_${matchIndex}t_${teamIndex}`"
            :value="matches[matchIndex][teamIndex.toString()]"
            @input="updateTeamName"
            :disabled="!isRoomHashFresh && $route.name !== 'Admin'"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Component, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';

@Component(
  {
    computed: {
      ...mapState(['numberOfMatches', 'teamsPerMatch', 'matches', 'roomHash', 'isRoomHashFresh', 'flipState']),
    },
    // watch: {
    //   matches(newMatches) {
    //     console.log(newMatches);
    //     if (newMatches.length !== this.numberOfMatches) {
    //       const updatedMatches = Array.from({ length: this.numberOfMatches }, (v, i) => (
    //         Array.from({ length: this.teamsPerMatch }, (vv, ii) => ({
    //           position: i,
    //           name: '',
    //         }))
    //       ));
    //       this.$store.commit('setMatches', updatedMatches);
    //     }
    //   },
    // },
  },
)
export default class Matches extends Vue {
  updateTeamName(event) {
    const teamName = event.target.value;
    const matchIndex = event.target.id.split('m_')[1].split('t_')[0];
    const teamIndex = event.target.id.split('m_')[1].split('t_')[1];
    this.$gun
      .get(this.roomHash)
      .get('roomData')
      .get('matches')
      .get(`match_${matchIndex}`)
      .get(`team_${teamIndex}`)
      .get('name')
      .put(teamName);

    const newMatches = [...this.matches];
    newMatches[matchIndex][teamIndex.toString()] = teamName;
    this.$store.commit('setMatches', newMatches);
  }

  @Watch('numberOfMatches')
  onMatchesChanged(newNumberOfMatches: number, oldNumberOfMatches: number) {
    if (this.matches.length !== newNumberOfMatches) {
      this.padMatches();
    }
  }

  @Watch('teamsPerMatch')
  async onTeamsPerMatchChanged(newTeamsPerMatch: number, oldTeamsPerMatch: number) {
    await this.$store.commit('setMatches', []);
    this.padMatches();
  }

  padMatches() {
    if (this.matches.length < this.numberOfMatches) {
      const newMatches = Array.from(
        { length: this.numberOfMatches - this.matches.length },
        (v, i) => {
          const match = {};
          for (let ii = 0; ii < this.teamsPerMatch; ii += 1) {
            match[ii.toString()] = '';
          }
          return match;
        },
      );
      this.$store.commit('setMatches', newMatches.concat([...this.matches]));
    } else if (this.matches.length > this.numberOfMatches) {
      this.$store.commit('setMatches', this.matches.slice(0, this.numberOfMatches));
    }
  }
}
</script>

<style lang="scss">
.intro {
  color: #252525;
  font-family: Poppins;
  font-size: 48px;
  font-weight: 400;
  line-height: 60px;

  margin-top: 40%;

  strong {
    /* Text style for "Greetings" */
    font-weight: 600;
    display: inline-block;
    position: relative;

    &::before {
      content: '';
      display: block;
      position: absolute;
      bottom: 5px;
      z-index: -1;
      width: 100%;
      height: 22px;
      background-color: #ffcc00;
    }
  }
}
.match-container {
  display: block;
  min-width: 100%;
  max-width: 100%;
  width: 100%;
  overflow: hidden;

  color: #252525;
  font-family: "IBM Plex Mono";
  font-style: italic;
  font-size: 24px;
  line-height: 60px;

  // input,
  .team-heading {
    width: 30%;
    padding: 5px;
    // margin-left: 5px;
    // margin-right: 5px;
    display: block;
    float: left;
    overflow: hidden;

    input {
      width: calc(100% - 28px);
    }
  }

  &.four {
    .team-heading {
      width: 18%;
    }
  }

  @media (max-width: 767px) {
    .team-heading {
      width: calc(100% - 24px) !important;
    }
  }

  input:disabled {
    border-color: #252525;
    font-weight: 900;
    color: #252525;
  }

  .flipped {
    background-color: #a3d0f7;

    &:nth-child(2n+1) {
      background-color: #ffeb9b;
    }

    &.light {
      background-color: #e9f0f6;

      &:nth-child(2n+1) {
        background-color: #faf9f6;
      }
    }
  }
}
</style>
