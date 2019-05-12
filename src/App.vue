<template>
    <v-app>
        <v-container>
            <v-layout
                    row wrap fill-height
                    style="min-height: 300px;"
            >

                <v-flex
                        xs12 md12 lg4 d-flex
                        v-if="!hideDropzone"
                >

                    <v-card
                            class="ma-2"
                            style="max-height: 50vh;"
                    >
                        <drop-zone
                                @reading="onFileReading"
                                @read="onFileRead"
                                @readError="onFileReadError"
                                :name="file.name"
                                :size="file.data && file.data.length"
                        ></drop-zone>
                    </v-card>

                </v-flex>

                <v-flex
                        xs12 md12 lg8
                        :lg12="hideDropzone"
                >
                    <v-layout row wrap>

                        <v-flex xs12>
                            <v-expand-transition>
                                <v-layout row wrap v-if="!hidePromo">
                                    <!-- Promo card -->
                                    <v-flex xs12>
                                        <v-card class="ma-2">
                                            <v-card-text>
                                                <b>PExplorer For Web</b> - Tool to view information of executable
                                                files<br>
                                                By @Jkulvich 2019 ✌
                                            </v-card-text>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-expand-transition>
                        </v-flex xs12>

                        <!-- Блоки с информацие о загрузке и ошибках информации -->
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
                            <expand-card
                                    :show="isBrowserNotSupported"
                                    icon="warning"
                                    text="Browser compatibility issue"
                            ></expand-card>
                        </v-flex>

                        <!-- Вкладки с типами информации -->
                        <v-flex xs12>
                            <v-expand-transition>
                                <v-card flat v-if="file.data" class="mt-2">
                                    <v-tabs
                                            v-model="tab"
                                            grow
                                    >
                                        <v-tab
                                                v-for="currentTab in tabs"
                                                :key="currentTab.name"
                                                ripple
                                                class="mx-2"
                                        >
                                            {{ currentTab.text }}
                                        </v-tab>

                                        <!-- General tab -->
                                        <v-tab-item key="general" class="mt-2">
                                            <v-layout row wrap fill-height>
                                                <!-- Дружественное описание файла -->
                                                <v-flex xs12>
                                                    <v-card class="ma-2" v-if="file.userFriendlyDesc !== ''">
                                                        <v-card-text>
                                                            ✨ {{file.userFriendlyDesc}}
                                                        </v-card-text>
                                                    </v-card>
                                                </v-flex>
                                                <!-- Описание основных характеристик -->
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
                                            </v-layout>
                                        </v-tab-item>

                                        <!-- Headers tab -->
                                        <v-tab-item key="headers" class="mt-2">
                                            <v-layout row wrap fill-height>
                                                <!-- DOS Header -->
                                                <v-flex xs12>
                                                    <expansion-table-card
                                                            title="DOS Headers"
                                                            :items="file.dosInfo"
                                                            :show="!!file.dosInfo.length"
                                                    ></expansion-table-card>
                                                </v-flex>
                                                <!-- NT Header -->
                                                <v-flex xs12>
                                                    <expansion-table-card
                                                            title="NT Headers"
                                                            :items="file.ntInfo"
                                                            :show="!!file.ntInfo.length"
                                                    ></expansion-table-card>
                                                </v-flex>
                                            </v-layout>
                                        </v-tab-item>

                                    </v-tabs>
                                </v-card>
                            </v-expand-transition>
                        </v-flex>

                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
    import EXEParser from '@/assets/scripts/parser/EXEParser'

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
                hideDropzone: false,
                hidePromo: false,

                tab: null,
                tabs: [
                    {
                        showDropzone: true,
                        name: 'general',
                        text: 'general',
                    },
                    {
                        name: 'headers',
                        text: 'headers',
                    },
                ],

                isFileReading: false,
                isFileError: false,
                isFileUnknown: false,
                isBrowserNotSupported: true,

                file: {
                    name: "",
                    data: null,
                    general: [],
                    dosInfo: [],
                    ntInfo: [],
                    userFriendlyDesc: "",
                },
            }
        },
        watch: {
            tab() {
                let t = this.tabs[this.tab];
                this.hideDropzone = !t.showDropzone;
                this.hidePromo = !t.showDropzone;
            },
        },
        mounted() {
            if ("Uint8Array" in window && "FileReader" in window && "Promise" in window)
                this.isBrowserNotSupported = false;
            else
                this.isBrowserNotSupported = true;
        },
        methods: {
            onFileReading(name, size) {
                this.isFileReading = true;
                this.isFileError = false;
                this.isFileUnknown = false;
                this.file.general = [];
                this.file.dosInfo = [];
                this.file.ntInfo = [];
                this.file.data = null;
            },
            onFileReadError(name, size) {
                this.isFileReading = false;
                this.isFileError = true;
            },
            onFileRead(name, bytes) {
                this.isFileReading = false;
                this.file.name = name;
                this.file.data = bytes;

                if (!EXEParser.isExe(bytes))
                    this.isFileUnknown = true;
                else {
                    let info = EXEParser.readInfo(bytes);

                    this.file.dosInfo = info.dos;
                    this.file.ntInfo = info.nt;
                    this.file.general = info.general;
                    this.file.userFriendlyDesc = info.magic;
                }
            },
        },
    }
</script>

<style scoped>
</style>
