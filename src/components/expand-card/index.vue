<template>
  <v-expand-transition>
    <div v-if="show">
      <v-card class="ma-2">
        <v-card-title>
          <v-icon
            v-if="icon"
            color="red"
            class="mr-3"
          >
            {{icon}}
          </v-icon>
          {{text}}
        </v-card-title>
      </v-card>
    </div>
  </v-expand-transition>
</template>

<script>
  export default {
    name: "expandCard",
    props: {
      show: Boolean,
      icon: String,
      text: String,
    },
  }
</script>

<style scoped>
</style>
