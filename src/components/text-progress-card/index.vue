<template>
  <v-expand-transition>
    <div v-if="active">
      <v-card class="ma-2">
        <v-card-title>
          <v-progress-circular
            indeterminate
            color="primary"
            class="mr-3"
          ></v-progress-circular>
          {{text}}
        </v-card-title>
      </v-card>
    </div>
  </v-expand-transition>
</template>

<script>
  export default {
    name: "textProgressCard",
    props: {
      text: String,
      active: Boolean,
    },
  }
</script>

<style scoped>
</style>
