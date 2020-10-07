import Vue from 'vue';
import Vuex from 'vuex';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

import Gun from 'gun';
import 'gun/lib/then';
import VueGun from 'vue-gun';

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
    flipType: null,
    flipState: 'waiting',
    teamsPerMatch: null,
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
    },
    setPresent(state, newPresent) {
      Vue.set(state, 'present', [...newPresent]);
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
        state.matches = [];
        for (let i = 0; i < state.numberOfMatches; i += 1) {
          // TODO possible bug here
          const tempMatch = {};
          gun.get(roomHash)
            .get('roomData')
            .get('matches')
            .get(`match_${i}`)
            .map()
            .once((value, teamId) => {
              console.log(value, teamId);
            });
          for (let ii = 0; ii < state.teamsPerMatch; ii += 1) {
            gun.get(roomHash)
              .get('roomData')
              .get('matches')
              .get(`match_${i}`)
              .get(`team_${ii}`)
              .get('name')
              .once((thing) => {
                tempMatch[ii.toString()] = thing;
              });
          }
          state.matches.push(tempMatch);
        }
        state.present = [];
        gun.get(roomHash)
          .get('roomData')
          .get('present')
          .map()
          .on((val, key) => {
            console.log(val, key);
            if (key !== 'present') {
              const seconds = 15;
              const dateNow = new Date();
              const date15SecondsAgo = new Date(dateNow.getTime() - seconds * 1000);
              const timestamp = new Date(val);
              console.log(timestamp, date15SecondsAgo);
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
