import Vue from 'vue';
import Vuex from 'vuex';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

import Gun from 'gun';
import 'gun/lib/then';
import VueGun from 'vue-gun';

// create empty matches utility
function createEmptyMatches(numberOfMatches: number, teamsPerMatch: number) {
  const matches = [];
  return Array.from(
    { length: numberOfMatches - matches.length },
    (v, i) => {
      const match = {};
      for (let ii = 0; ii < teamsPerMatch; ii += 1) {
        match[ii.toString()] = '';
      }
      return match;
    },
  );
}

// First, check if there's a hash in the URL bar
let roomHash = uuidv4();
let isRoomHashFresh = true;
if (uuidValidate(window.location.hash.substr(1))) {
  roomHash = window.location.hash.substr(1);
  isRoomHashFresh = false;
}
window.location.hash = roomHash;

const gun = Gun(['https://gun.djnd.si/gun']);
Vue.use(VueGun, {
  gun,
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    roomName: '',
    flipType: '',
    flipState: 'waiting',
    flipTime: null,
    teamsPerMatch: 0,
    numberOfMatches: 0,
    enableChat: false,
    publicUUID: uuidv4(),
    roomHash,
    isRoomHashFresh,
    matches: [],
    present: [],
    userName: '',
    signedIn: false,
    admin: false,
  },
  mutations: {
    setRoomName(state, newRoomName) {
      state.roomName = newRoomName;
    },
    setFlipType(state, newFlipType) {
      state.flipType = newFlipType;
    },
    setFlipState(state, newFlipState) {
      state.flipState = newFlipState;
    },
    setTeamsPerMatch(state, newTeamsPerMatch) {
      state.teamsPerMatch = newTeamsPerMatch;
    },
    setNumberOfMatches(state, newNumberOfMatches) {
      state.numberOfMatches = newNumberOfMatches;
    },
    setEnableChat(state, newEnableChat) {
      state.enableChat = newEnableChat;
    },
    setPublicUUID(state, newPublicUUID) {
      state.publicUUID = newPublicUUID;
    },
    setRoomHash(state, newRoomHash) {
      state.roomHash = newRoomHash;
    },
    setIsRoomHashFresh(state, newIsRoomHashFresh) {
      state.isRoomHashFresh = newIsRoomHashFresh;
    },
    setUserName(state, newUserName) {
      state.userName = newUserName;
    },
    setSignedIn(state, newSignedIn) {
      state.signedIn = newSignedIn;
    },
    setAdmin(state, newAdmin) {
      state.admin = newAdmin;
    },
    setMatches(state, newMatches) {
      Vue.set(state, 'matches', [...newMatches]);

      // newMatches.forEach((match, i) => {
      //   console.log(match);
      //   Object.keys(match).forEach((team) => {
      //     gun.get(state.roomHash)
      //       .get('roomData')
      //       .get('matches')
      //       .get(`match_${i}`)
      //       .get(`team_${team}`)
      //       .get('name')
      //       .put(match[team]);

      //     gun.get(state.roomHash)
      //       .get('roomData')
      //       .get('matches')
      //       .get(`match_${i}`)
      //       .get(`team_${team}`)
      //       .get('position')
      //       .put('unknown');
      //   });
      // });
    },
    setPresent(state, newPresent) {
      Vue.set(state, 'present', [...newPresent]);
    },
    setFlipTime(state) {
      this.state.flipTime = new Date();
    },
  },
  actions: {
    async loadGunData({ state }) {
      const roomData = await gun.get(roomHash).get('roomData').once()
        .then();
      if (roomData) {
        state.roomName = await gun.get(roomHash).get('roomData').get('roomName').once()
          .then();
        state.flipType = await gun.get(roomHash).get('roomData').get('flipType').once()
          .then();
        state.teamsPerMatch = await gun.get(roomHash).get('roomData').get('teamsPerMatch').once()
          .then();
        state.numberOfMatches = await gun.get(roomHash).get('roomData').get('numberOfMatches').once()
          .then();
        state.enableChat = await gun.get(roomHash).get('roomData').get('enableChat').once()
          .then();
        state.publicUUID = await gun.get(roomHash).get('roomData').get('publicUUID').once()
          .then();
        state.matches = createEmptyMatches(state.numberOfMatches, state.teamsPerMatch);
        gun.get(roomHash)
          .get('roomData')
          .get('matches')
          .map()
          .once((match, matchId) => {
            const matchNumericalId = parseInt(matchId.split('_')[1], 10);
            // update matches
            gun.get(roomHash)
              .get('roomData')
              .get('matches')
              .get(matchId)
              .map()
              .once(async (team, teamId) => {
                const teamNumericalId = teamId.split('_')[1];
                gun.get(roomHash)
                  .get('roomData')
                  .get('matches')
                  .get(matchId)
                  .get(teamId)
                  .get('name')
                  .on((name) => {
                    const tempMatch = { ...state.matches[matchNumericalId] };
                    tempMatch[teamNumericalId] = name;
                    Vue.set(
                      state.matches,
                      matchNumericalId,
                      tempMatch,
                    );
                  });
              });
          });
        state.present = [];
        gun.get(roomHash)
          .get('roomData')
          .get('present')
          .map()
          .on((val, key) => {
            if (key !== 'present') {
              const seconds = 15;
              const dateNow = new Date();
              const date15SecondsAgo = new Date(dateNow.getTime() - seconds * 1000);
              const timestamp = new Date(val);
              if (timestamp > date15SecondsAgo) {
                if (!state.present.includes(key)) {
                  state.present.push(key);
                }
              } else {
                console.log('remove', key);
                state.present.splice(state.present.indexOf(key), 1);
              }
            }
          });

        // start following flipState
        gun.get(roomHash)
          .get('roomData')
          .get('flipState')
          .on((flipState) => {
            state.flipState = flipState;
          });
      }
    },
  },
  modules: {
  },
});
