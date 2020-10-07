<template>
  <div class="avatar-container">
    <svg viewBox="0 0 24 24" width="60" v-html="avatar" class="avatar"></svg>
    <div class="name">{{ name }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as avatars from '../utilities/avatars';

@Component
export default class Avatar extends Vue {
  private avatar: string;

  @Prop() private name!: string;

  constructor() {
    super();
    this.avatar = avatars.inner(avatars.random(), 80);
  }
}
</script>

<style lang="scss">
.avatar-container {
  width: 80px;
  display: inline-block;
  overflow: hidden;
  padding: 10px;

  .avatar {
    display: block;
    width: 60px;
    height: 60px;

    background: #ffffff;

    border-radius: 50%;
    padding: 5px;
    margin: auto;
  }

  .name {
    text-align: center;
    font-family: "IBM Plex Mono";
    font-style: italic;
    margin-top: 5px;
  }
}
</style>
