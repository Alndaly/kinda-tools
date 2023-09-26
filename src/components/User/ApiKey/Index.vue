<template>
  <q-table flat bordered ref="tableRef" :rows="rows" :columns="columns" row-key="id" v-model:pagination="pagination"
    :loading="loading" :filter="filter" binary-state-sort @request="onRequest">
    <template v-slot:top>
      <div class="q-mr-md text-h6 text-weight-bold">APIKEY</div>
      <q-btn round outline color="primary" icon="add" size="sm" @click="onAddApiKey" />
      <q-space />
      <q-input borderless dense debounce="300" v-model="filter" placeholder="搜索">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body-cell-action="props">
      <q-td :props="props">
        <q-btn outline color="negative" label="停用" size="sm" @click="onDeleteApiKey(props.row)" />
      </q-td>
    </template>
    <template v-slot:body-cell-key="props">
      <q-td :props="props">
        <div class="flex row items-center">
          <span class="q-mr-md">{{ props.row.key }}</span>
          <q-btn dense class="q-pa-sm" outline color="primary" icon="content_copy" size="xs"
            @click="onCopyApiKey(props.row)" />
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { addApiKey, deleteApiKey, getApiKey } from '@/services/user';
import message from '@/utils/message';
import { ref, onMounted } from 'vue'
import { copyToClipboard } from 'quasar';

const columns = [
  { name: 'id', label: 'ID', align: 'left', field: 'id' },
  { name: 'key', label: 'APIKEY', align: 'left', field: 'key' },
  { name: 'create_time', align: 'left', label: '创建时间', field: 'create_time' },
  { name: 'action', align: 'left', label: '操作', field: 'action' }
]

const rows = ref([]);

const tableRef = ref();
const filter = ref('');
const loading = ref(false);
const pagination = ref({
  sortBy: 'desc',
  descending: true,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 10
});

const onRequest = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination

  loading.value = true
  const [res, err] = await getApiKey({ page_num: page - 1, page_size: rowsPerPage, descending })

  if (err) {
    message.error('出错啦')
  }
  // clear out existing data and add new
  rows.value = res.list

  // don't forget to update local pagination object
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.rowsNumber = res.total_size
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending

  // ...and turn of loading indicator
  loading.value = false
}

const onCopyApiKey = (props: any) => {
  copyToClipboard(props.key).then(res => message.success('复制成功')).catch(err => message.error('复制失败'))
}

const onDeleteApiKey = async (props) => {
  const [res, err] = await deleteApiKey({ id: props.id });
  if (err) {
    message.error('出错啦');
  }
  tableRef.value.requestServerInteraction()
}

const onAddApiKey = async () => {
  const [res, err] = await addApiKey();
  if (err) {
    message.error('出错啦');
  }
  tableRef.value.requestServerInteraction()
  pagination.value.page = 1
}

onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction()
})
</script>
