<template>
  <div id="app">
    <router-view/>
    <div class="side-flip-logo"></div>
    <footer>
      <p>Development team:</p>
      <div class="logo zip"></div>
      <div class="logo hdd"></div>
      <div class="logo idea"></div>
      <div class="logo eu"></div>
    </footer>
  </div>
</template>

<script lang="ts">
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import Vue from 'vue';
import capitalize from '@/utilities/capitalize';

export default class App extends Vue {}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital@1&family=Poppins:ital,wght@0,300;0,400;0,900;1,900&display=swap');
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  min-height: 100vh;

  overflow: hidden;
}

.side-flip-logo {
  width: 240px;
  height: 80px;
  background-image: url('./assets/logo.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  display: block;

  position: absolute;

  top: 0;
  left: 50%;
  margin-left: -120px;

  margin-top: 22px;
}

h1 {
  color: #252525;
  font-family: "Poppins";
  font-size: 24px;
  font-weight: 900;
  line-height: 48px;
  position: relative;
  display: inline-block;

  &::before {
    content: '';
    display: block;
    position: absolute;
    bottom: 5px;
    z-index: -1;
    width: 100%;
    height: 16px;
    background-color: #ffcc00;
  }
}

input {
  border: 4px solid #3098f3;
  background-color: #ffffff;
  line-height: 60px;
  font-family: Poppins;
  font-size: 20px;
  line-height: 48px;
  font-weight: 400;
}
label {
  color: #252525;
  font-family: "IBM Plex Mono";
  font-style: italic;
  font-size: 20px;
  line-height: 60px;
}
input[type=text] {
  padding-left: 10px;
  padding-right: 10px;
}
input[type=number] {
  width: 60px;
}

footer {
  position: relative;
  width: 100%;
  min-height: 100px;
  background: #ffffff;

  border-top: 1px solid #3098f3;

  overflow: hidden;

  display: block;

  p {
    color: #252525;
    font-family: Poppins;
    font-size: 16px;
    font-weight: 300;
    line-height: 14px;
    padding: 10px;
    margin: 0;
    margin-top: -9px;
    line-height: 100px;

    float: left;

    @media (max-width: 575px) {
      display: none;
    }
  }

  .logo {
    width: 100px;
    height: 100px;

    float: left;

    // background-size: contain;
    background-position: center;
    background-repeat: no-repeat;

    &.zip {
      background-image: url('./assets/ZiP_logo.png');
    }
    &.hdd {
      background-image: url('./assets/HDD_logo.png');
      width: 180px;
    }
    &.idea {
      background-image: url('./assets/IDEA_logo.png');
    }
    &.eu {
      background-image: url('./assets/EU_logo.png');
      width: 240px;
      float: right;
    }
  }
}

.split-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;

  .split {
    min-width: 320px;
    width: 100%;
    min-height: calc(100vh - 600px);
    flex: 1;
    padding: 80px;

    &.left {
      background-color: #f5f2e7;
      // background-image: linear-gradient(to right, #f5f2e8 0%, #faf9f6 100%);
      background-image: linear-gradient(to right, #f5f0e2 0%, #fbfbfa 100%);
    }
  }

  @media (max-width: 1199px) {
    flex-wrap: wrap;

    .split {
      flex-shrink: 0;
    }
  }
}

@media (max-width: 1119px) {
  h1 {
    font-size: 22px;
  }
}

.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background: rgba(48, 152, 243, 0.8);

  z-index: 10;
}
.modal-inner {
  max-width: 500px;
  margin: auto;
  margin-top: 100px;
  background-color: #ffffff;

  padding: 100px;
}

@media (max-width: 767px) {
  .team-heading {
    width: calc(100% - 24px) !important;
  }

  .hidden-xs {
    display: none !important;
  }
}

@media (min-width: 768px) {
  .visible-xs {
    display: none !important;
  }
}
</style>
