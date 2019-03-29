<template>
  <v-app>
    <v-container>
      <v-layout row wrap fill-height>
        <v-flex xs12 md4 lg4 d-flex>
          <v-card class="ma-2" style="max-height: 50vh">
            <drop-zone
              @reading="onFileReading"
              @read="onFileRead"
              @readError="onFileReadError"
            ></drop-zone>
          </v-card>
        </v-flex>
        <v-flex xs12 md8 lg8>
          <v-layout row wrap>

            <v-flex xs12>
              <v-card class="ma-2">
                <v-card-text>
                  <b>PExplorer For Web</b> - Tool to view information of executable files<br>
                  By @Jkulvich 2019 ✌
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs12>
              <contact-card></contact-card>
            </v-flex>

            <v-flex xs12>
              <text-progress-card
                :active="isFileReading"
                text="File reading ..."
              ></text-progress-card>
            </v-flex>

            <v-flex xs12>
              <expand-card
                :show="isFileError"
                icon="warning"
                text="Can't read this file"
              ></expand-card>
            </v-flex>

            <v-flex xs12>
              <expand-card
                :show="isFileUnknown"
                icon="warning"
                text="File isn't executable"
              ></expand-card>
            </v-flex>

            <v-flex xs12>
              <v-expand-transition>
                <v-card
                  flat
                  class="ma-2"
                  v-if="file.general.length">
                  <v-expansion-panel
                    :value="[true]"
                    expand
                  >
                    <v-expansion-panel-content>
                      <template v-slot:header>
                        <div>General</div>
                      </template>
                      <v-data-table
                        :items="file.general"
                        hide-actions
                        hide-headers
                      >
                        <template v-slot:items="props">
                          <td><b>{{ props.item.name }}</b></td>
                          <td>{{ props.item.value }}</td>
                        </template>
                      </v-data-table>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-card>
              </v-expand-transition>
            </v-flex>

            <v-flex xs12>
              <expansion-table-card
                title="DOS Headers"
                :items="file.dosInfo"
                :show="!!file.dosInfo.length"
              ></expansion-table-card>
            </v-flex>

            <v-flex xs12>
              <expansion-table-card
                title="NT Headers"
                :items="file.ntInfo"
                :show="!!file.ntInfo.length"
              ></expansion-table-card>
            </v-flex>

          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
  import EXEParser from '@/assets/scripts/EXEParser'

  import DropZone from '@/components/dropzone'
  import TextProgressCard from '@/components/text-progress-card'
  import ExpandCard from '@/components/expand-card'
  import ContactCard from '@/components/contact-card'
  import ExpansionTableCard from '@/components/expansion-table-card'

  export default {
    name: 'App',
    components: {
      DropZone,
      TextProgressCard,
      ExpandCard,
      ContactCard,
      ExpansionTableCard,
    },
    data() {
      return {
        isFileReading: false,
        isFileError: false,
        isFileUnknown: false,
        file: {
          general: [],
          dosInfo: [],
          ntInfo: [],
        },
      }
    },
    methods: {
      onFileReading(name, size) {
        this.isFileReading = true;
        this.isFileError = false;
        this.isFileUnknown = false;
        this.file.general = [];
        this.file.dosInfo = [];
        this.file.ntInfo = [];
      },
      onFileReadError(name, size) {
        this.isFileReading = false;
        this.isFileError = true;
      },
      onFileRead(name, bytes) {
        this.isFileReading = false;

        let parser = new EXEParser();
        parser.setFile(bytes);
        if (!parser.isExe())
          this.isFileUnknown = true;
        else {
          let dosHeader = parser.readDOSHeader();
          let ntHeader = parser.readNTHeader(dosHeader);
          let generalInfo = parser.readGeneralInfo(ntHeader);

          //TODO: Не падать если e_lfanew ссылается за пределы файла
          this.file.dosInfo = dosHeader;
          this.file.ntInfo = ntHeader;
          this.file.general = generalInfo;
        }
      },
    },
  }
</script>

<style scoped>
</style>
