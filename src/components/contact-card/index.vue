<template>
  <v-card class="ma-2">
    <v-card-title>
      <v-chip @click="openLink('https://vk.com/jkulvich')">
        <v-avatar>
          <img src="@/assets/icons/vk.png" alt="Yuri in Vkontakte">
        </v-avatar>
        VK
      </v-chip>
      <v-chip @click="openLink('https://t.me/jkulvich')">
        <v-avatar>
          <img src="@/assets/icons/tg.png" alt="Yuri in Telegram">
        </v-avatar>
        TG
      </v-chip>
      <v-chip @click="openLink('https://twitter.com/jkulvich')">
        <v-avatar>
          <img src="@/assets/icons/tw.png" alt="Yuri in Telegram">
        </v-avatar>
        TW
      </v-chip>
      <v-chip @click="openLink('https://github.com/jkulvich')">
        <v-avatar>
          <img src="@/assets/icons/gh.png" alt="Yuri in GitHub">
        </v-avatar>
        GH
      </v-chip>
    </v-card-title>
  </v-card>
</template>

<script>
    export default {
        name: "contactCard",
      methods: {
        openLink(url) {
          window.open(url, "_blank");
        },
      },
    }
</script>

<style scoped>
</style>
