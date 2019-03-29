<template>
  <v-expand-transition>
    <v-card flat class="ma-2" v-if="show">
      <v-expansion-panel>
        <v-expansion-panel-content>
          <template v-slot:header>
            <div>{{title}}</div>
          </template>
          <v-data-table
            :headers="headers"
            :items="items"
            hide-actions
          >
            <template v-slot:items="props">
              <td>{{ props.item.offset }}</td>
              <td><b>{{ props.item.name }}</b></td>
              <td>{{ props.item.data }}</td>
              <td>{{ props.item.type }}</td>
              <td>{{ props.item.value }}</td>
              <td>{{ props.item.desc }}</td>
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card>
  </v-expand-transition>
</template>

<script>
  //hide-headers
  export default {
    name: "expansionTableCard",
    props: {
      title: String,
      items: Array,
      show: Boolean,
    },
    data() {
      return {
        headers: [
          {
            text: "Offset",
            align: "left",
            sortable: true,
            value: "offset",
            width: "100px",
          },
          {
            text: 'Name',
            align: 'left',
            sortable: true,
            value: 'name',
            width: '100px',
          },
          {
            text: 'Data',
            align: 'left',
            sortable: true,
            value: 'data',
            width: "100px",
          },
          {
            text: 'Type',
            align: 'left',
            sortable: true,
            value: 'type',
            width: "50px",
          },
          {
            text: 'Value',
            align: 'left',
            sortable: true,
            value: 'value',
            width: "100px",
          },
          {
            text: 'Desc',
            align: 'left',
            sortable: true,
            value: 'desc',
            width: "400px",
          },
        ],
      }
    },
  }
</script>

<style scoped>

</style>
