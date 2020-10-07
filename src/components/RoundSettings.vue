<template>
  <div class="round-settings">
    <h1>Round settings</h1>
    <div class="setting-container">
      <label for="room-name">Room name</label>
      <input
        type="text"
        name="room-name"
        id="room-name"
        v-model="roomName"
        :disabled="!isRoomHashFresh">
    </div>
    <div class="setting-container">
      <label for="sides">Sides</label>
      <div class="radio-container">
        <span class="label">Give choice</span>
        <input
          type="radio"
          name="sides"
          value="give choice"
          v-model="flipType"
          :disabled="!isRoomHashFresh">
      </div>
      <div class="radio-container">
        <span class="label">Delegate sides</span>
        <input
          type="radio"
          name="sides"
          value="determine"
          v-model="flipType"
          :disabled="!isRoomHashFresh">
      </div>
    </div>
    <div class="setting-container teams">
      <label for="number-of-teams">Teams per match</label>
      <div class="radio-container">
        <span class="label">2</span>
        <input
          type="radio"
          name="number-of-teams"
          :value="2"
          v-model="teamsPerMatch"
          :disabled="!isRoomHashFresh">
      </div>
      <div class="radio-container">
        <span class="label">4</span>
        <input
          type="radio"
          name="number-of-teams"
          :value="4"
          v-model="teamsPerMatch"
          :disabled="!isRoomHashFresh">
      </div>
    </div>
    <div class="setting-container">
      <label for="number-of-matches">Number of matches</label>
      <input
        v-model="numberOfMatches"
        type="number"
        name="number-of-matches"
        id="number-of-matches"
        :disabled="!isRoomHashFresh"
      >
    </div>
    <div class="setting-container">
      <label for="enable-chat">Chat?</label>
      <div class="neumorphism-container">
        <span>yes</span>
        <div class="neumorphism-toggle">
          <input
            type="checkbox"
            id="neumorphism"
            name="enable-chat"
            class="switch"
            v-model="enableChat"
          >
          <label for="neumorphism">
            <div class="switch">
              <div class="dot"></div>
            </div>
          </label>
        </div>
        <span>no</span>
      </div>
    </div>
    <matches class="visible-xs" />
    <button
      type="submit"
      @click.prevent="createRound"
    >{{ isRoomHashFresh ? 'Create' : 'Update' }} round</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';
import Matches from '@/components/Matches.vue';

@Component({
  components: {
    Matches,
  },
  computed: {
    ...mapState(['matches', 'isRoomHashFresh']),
    roomName: {
      get() {
        return this.$store.state.roomName;
      },
      set(newRoomName) {
        this.$store.commit('setRoomName', newRoomName);
      },
    },
    flipType: {
      get() {
        return this.$store.state.flipType;
      },
      set(newFlipType) {
        this.$store.commit('setFlipType', newFlipType);
      },
    },
    teamsPerMatch: {
      get() {
        return this.$store.state.teamsPerMatch;
      },
      set(newTeamsPerMatch) {
        this.$store.commit('setTeamsPerMatch', newTeamsPerMatch);
      },
    },
    numberOfMatches: {
      get() {
        return this.$store.state.numberOfMatches;
      },
      set(newNumberOfMatches) {
        this.$store.commit('setNumberOfMatches', parseInt(newNumberOfMatches, 10));
      },
    },
    enableChat: {
      get() {
        return this.$store.state.enableChat;
      },
      set(newEnableChat) {
        this.$store.commit('setEnableChat', newEnableChat);
      },
    },
    roomHash: {
      get() {
        return this.$store.state.roomHash;
      },
      set(newRoomHash) {
        this.$store.commit('setRoomHash', newRoomHash);
      },
    },
    publicUUID: {
      get() {
        return this.$store.state.publicUUID;
      },
      set(newPublicUUID) {
        this.$store.commit('setPublicUUID', newPublicUUID);
      },
    },
  },
})
export default class RoundSettings extends Vue {
  createRound() {
    this.$gun.get(this.roomHash).get('roomData').put({
      roomName: this.roomName,
      flipType: this.flipType,
      teamsPerMatch: this.teamsPerMatch,
      numberOfMatches: this.numberOfMatches,
      enableChat: this.enableChat,
      publicUUID: this.publicUUID,
    });

    this.matches.forEach((match, i) => {
      Object.keys(match).forEach((team) => {
        this.$gun.get(this.roomHash)
          .get('roomData')
          .get('matches')
          .get(`match_${i}`)
          .get(`team_${team}`)
          .get('name')
          .put(match[team]);

        this.$gun.get(this.roomHash)
          .get('roomData')
          .get('matches')
          .get(`match_${i}`)
          .get(`team_${team}`)
          .get('position')
          .put('unknown');
      });
    });
    this.$store.commit('setAdmin', true);
    this.$store.state.isRoomHashFresh = false;

    this.$router.push(`/#${this.roomHash}`);
  }
}
</script>

<style lang="scss">
.round-settings {
  @media (max-width: 767px) {
    margin-top: 30px;
  }
}
.setting-container {
  border-bottom: 1px solid #252525;
  display: block;
  overflow: hidden;
  min-height: 83px;
  line-height: 83px;

  input {
    max-width: calc(100% - 18px);
    float: right;
    padding-left: 5px;
    padding-right: 5px;

    &:focus {
      outline: none;
    }
  }

  #room-name {
    width: 100%;
    display: block;
    margin-bottom: 10px;
  }

  & > label {
    display: inline-block;
    padding-top: 15px;
  }

  .radio-container {
    padding-right: 2px;
    font-family: Poppins;
    font-size: 24px;
    font-weight: 400;
    line-height: 60px;

    display: block;
    float: right;

    overflow: hidden;

    margin-top: 14px;

    span {
      display: block;
      float: left;
      padding-right: 10px;
      width: 180px;
    }

    &:nth-child(3) {
      margin-right: 20px;
    }

    input[type="radio"] {
      width: 30px;
      line-height: 60px;
      display: inline-block;

      &:nth-child(1) {
        top: 17px;
      }

      &:nth-child(2) {
        top: 17px;
      }
    }
  }

  &.teams .radio-container {
    width: 60px;

    span {
      width: 20px;
    }
  }

  #number-of-matches {
    margin-top: 10px;
    text-align: center;
  }

  @supports(-webkit-appearance: none) or (-moz-appearance: none) {

    // input[type='checkbox'],
    input[type='radio'] {
      --active: #ffffff;
      --active-inner: #3098f3;
      --focus: 2px rgba(39, 94, 254, .3);
      --border: #3098f3;
      --border-hover: #3098f3;
      --background: #fff;
      --disabled: #F6F8FF;
      --disabled-inner: #E1E6F9;
      -webkit-appearance: none;
      -moz-appearance: none;
      height: 25px;
      outline: none;
      display: inline-block;
      vertical-align: top;
      position: relative;
      margin: 0;
      cursor: pointer;
      // border: 4px solid var(--bc, var(--border));
      border: 3px solid #3098f3;
      background: var(--b, var(--background));
      transition: background .3s, border-color .3s, box-shadow .2s;

      &:after {
        content: '';
        display: block;
        left: 0;
        top: 0;
        position: absolute;
        transition: transform var(--d-t, .3s) var(--d-t-e, ease), opacity var(--d-o, .2s);
      }

      &:checked {
        --b: var(--active);
        --bc: var(--active);
        --d-o: .3s;
        --d-t: .6s;
        --d-t-e: cubic-bezier(.2, .85, .32, 1.2);
      }

      &:disabled {
        --b: var(--disabled);
        cursor: not-allowed;
        opacity: .9;

        &:checked {
          // --b: var(--disabled-inner);
          // --bc: var(--border);
        }

        &+label {
          cursor: not-allowed;
        }
      }

      &:hover {
        &:not(:checked) {
          &:not(:disabled) {
            --bc: var(--border-hover);
          }
        }
      }

      &:focus {
        box-shadow: 0 0 0 var(--focus);
      }

      &:not(.switch) {
        width: 25px;

        &:after {
          opacity: var(--o, 0);
        }

        &:checked {
          --o: 1;
        }
      }

      &+label {
        font-size: 14px;
        line-height: 25px;
        display: inline-block;
        vertical-align: top;
        cursor: pointer;
        margin-left: 4px;
      }
    }

    input[type='checkbox'] {
      &:not(.switch) {
        border-radius: 7px;

        &:after {
          width: 5px;
          height: 9px;
          border: 2px solid var(--active-inner);
          border-top: 0;
          border-left: 0;
          left: 7px;
          top: 4px;
          transform: rotate(var(--r, 20deg));
        }

        &:checked {
          --r: 43deg;
        }
      }

      &.switch {
        width: 38px;
        border-radius: 11px;

        &:after {
          left: 2px;
          top: 2px;
          border-radius: 50%;
          width: 15px;
          height: 15px;
          background: var(--ab, var(--border));
          transform: translateX(var(--x, 0));
        }

        &:checked {
          --ab: var(--active-inner);
          --x: 17px;
        }

        &:disabled {
          &:not(:checked) {
            &:after {
              opacity: .6;
            }
          }
        }
      }
    }

    input[type='radio'] {
      border-radius: 50%;

      &:after {
        width: 19px;
        height: 19px;
        border-radius: 50%;
        background: var(--active-inner);
        opacity: 0;
        transform: scale(var(--s, .7));
      }

      // &:checked {
      //   --s: .5;
      // }
    }
  }

  .neumorphism-toggle {
    position: relative;
    transition: transform .3s;
    transform: scale(var(--scale, 1)) translateZ(0);

    &:active {
      --scale: .96;
    }

    input {
      display: none;

      &+label {
        // background: #fff;
        // border-radius: 9px;
        // padding: 16px 0 16px 20px;
        // min-width: 208px;
        display: block;
        cursor: pointer;
        position: relative;
        // box-shadow:
        //   -12px -12px 24px var(--light-shadow, transparent),
        //   12px 12px 24px var(--shadow, transparent);
        // transition: box-shadow .4s;

        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          border-radius: inherit;
          // background: linear-gradient(160deg, #F1F4FF, #F9FAFF);
          opacity: var(--gradient, 0);
          transition: opacity .4s;
        }

        .switch {
          position: relative;
          display: inline-block;
          z-index: 1;
          vertical-align: top;
          height: 22px;
          width: 45px;
          border-radius: 11px;
          background: #ECEFFC;

          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            border-radius: inherit;
            // background: linear-gradient(90deg, #4F97FF, #275EFE);
            background: #ffcc00;
            opacity: var(--gradient, 0);
            transition: opacity .4s;
          }

          .dot {
            background: #3098f3;
            position: absolute;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            left: -4px;
            top: -4px;
            transform: translateX(var(--offset, 0));
            transition: transform .4s, box-shadow .4s;
            box-shadow:
              -4px -4px 8px var(--light-shadow-2, transparent),
              4px 4px 8px var(--shadow, transparent);

            &:before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              border-radius: inherit;
              // background: linear-gradient(160deg, #F1F4FF, #F9FAFF);
              opacity: var(--gradient, 0);
              transition: opacity .4s;
            }
          }
        }

        span {
          line-height: 22px;
          font-size: 16px;
          color: var(--text, #646B8C);
          font-weight: 500;
          display: inline-block;
          vertical-align: top;
          z-index: 1;
          position: relative;
          margin-left: 12px;
          transition: color .4s;
        }

        &+span {
          text-align: center;
          display: block;
          position: absolute;
          left: 0;
          right: 0;
          top: 100%;
          opacity: 0;
          font-size: 12px;
          font-weight: 500;
          color: #A6ACCD;
          transform: translateY(4px);
          transition: opacity .4s, transform .4s;
        }
      }

      // &:not(:checked) {
      //   &+label {
      //     // pointer-events: none;

      //     &+span {
      //       opacity: 1;
      //       transform: translateY(12px);
      //     }
      //   }
      // }

      &:checked {
        &+label {
          --offset: 22px;
          --text: #404660;
          --gradient: 1;
          // --shadow: rgba(0, 6, 39, .1);
          // --light-shadow: rgba(255, 255, 255, .8);
          // --light-shadow-2: rgba(255, 255, 255, .1);
        }
      }
    }
  }

  .neumorphism-container {
    display: block;
    float: right;
    span {
      display: block;
      float: right;
      margin-right: 4px;
      margin-left: 10px;
      padding-top: 5px;

      font-size: 24px;

      &:last-child {
        margin-left: 0;
        margin-right: 20px;
      }
    }
    .neumorphism-toggle {
      display: block;
      width: auto;
      float: right;
      margin-top: 35px;
      margin-right: 5px;
    }
  }

  // .switch {
  //   margin-top: 20px !important;
  //   margin-right: 4px !important;
  //   display: inline-block;
  // }
}
button {
  box-shadow: none;
  border: none;
  width: 442px;
  height: 91px;
  border-radius: 45px;
  background-color: #3098f3;
  opacity: 0.7;

  color: #ffffff;
  font-family: "Poppins";
  font-style: italic;
  font-size: 36px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 2.16px;

  display: block;
  margin: auto;
  margin-top: 60px;

  cursor: pointer;

  &:hover {
    opacity: 1;
  }
}
</style>
