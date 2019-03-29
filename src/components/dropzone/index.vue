<template>
  <div id="dropzone">
    <v-layout
      row
      fill-height
      align-center
      justify-center
      ref="drop-area"
      @click="onClick"
    >
      <input ref="file" type="file" style="display: none;"/>
      <v-flex shrink>

        <div v-show="!readyToDrop">
          <template v-if="info.name">
            <v-data-table
              style="max-width: 300px"
              :items="[
              {
                name: 'NAME',
                value: info.name,
              },
              {
                name: 'SIZE',
                value: info.size,
              },
            ]"
              hide-actions
              hide-headers
            >
              <template v-slot:items="props">
                <td class="text-xs-right"><b>{{ props.item.name }}:</b></td>
                <td>{{ props.item.value }}</td>
              </template>
            </v-data-table>
          </template>
          <template v-else>
            <v-btn color="primary">
              <v-icon left>folder</v-icon>
              CLICK OR DROP FILE HERE
            </v-btn>
          </template>
        </div>

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  export default {
    name: "dropzone",
    data() {
      return {
        readyToDrop: false,
        info: {
          name: "",
          size: 0,
        },
      }
    },
    mounted() {
      let inputFile = this.$refs["file"];
      let dropArea = this.$refs["drop-area"];

      // Если есть выбранный файл - отправляем его на обработку
      inputFile.onchange = () => {
        if (inputFile.files.length > 0)
          this.onFileReceived(inputFile.files[0]);
      };

      // Отключение стандартной реакции браузера
      ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName =>
        dropArea.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
          },
          false
        )
      );

      // Реакция на перетаскивание
      dropArea.addEventListener("dragenter", e => {
        this.readyToDrop = true;
      }, false);
      dropArea.addEventListener("dragleave", e => {
        this.readyToDrop = false;
      }, false);
      dropArea.addEventListener("drop", e => {
        this.readyToDrop = false;
        if (e.dataTransfer.files.length > 0)
          this.onFileReceived(e.dataTransfer.files[0]);
      }, false);

    },
    methods: {
      // Открываем диалог выбора файла
      onClick() {
        this.$refs["file"].click();
      },
      // Реакция на получение файла
      onFileReceived(file) {
        this.info.name = file.name;
        this.info.size = file.size;
        this.$emit("reading", file.name, file.size);

        // Чтение файла
        let vue = this;
        let reader = new FileReader();
        reader.onload = function() {
          vue.$emit("read", file.name, new Uint8Array(this.result));
        };
        reader.onerror = function() {
          vue.$emit("readError", file.name, file.size);
        };
        reader.readAsArrayBuffer(file);
      },
    },
  }
</script>

<style scoped>
  #dropzone {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
