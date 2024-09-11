<template>
  <q-table flat bordered ref="tableRef" :rows="rows" :columns="columns" row-key="id" v-model:pagination="pagination"
    :loading="loading" :filter="filter" binary-state-sort @request="onRequest">
    <template v-slot:top>
      <div class="q-mr-md text-h6 text-weight-bold">License</div>
      <q-btn round outline color="primary" icon="add" size="sm" @click="onAddLicense" />
      <q-space />
      <q-input borderless dense debounce="300" v-model="filter" placeholder="搜索">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body-cell-action="props">
      <q-td :props="props">
        <q-btn outline color="negative" label="停用" size="sm" @click="onDeleteLicense(props.row)" />
      </q-td>
    </template>
    <template v-slot:body-cell-detail="props">
      <q-td :props="props">
        <div class="flex row items-center">
          <span class="q-mr-md">{{ props.row.detail }}</span>
          <q-btn dense class="q-pa-sm" outline color="primary" icon="content_copy" size="xs"
            @click="onCopyLicense(props.row)" />
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { addLicense, deleteLicense, getLicense } from '@/services/license';
import message from '@/utils/message';
import { ref, onMounted } from 'vue'
import { copyToClipboard } from 'quasar';

const columns = [
  { name: 'id', label: 'ID', align: 'left', field: 'id' },
  { name: 'detail', label: 'Detail', align: 'left', field: 'detail' },
  { name: 'is_used', label: '是否被使用', align: 'left', field: 'is_used' },
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
  const { page, rowsPerPage, sortBy } = props.pagination

  loading.value = true
  const [res, err] = await getLicense({ page_num: page - 1, page_size: rowsPerPage, keyword: filter.value })

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

  // ...and turn of loading indicator
  loading.value = false
}

const onCopyLicense = (props: any) => {
  copyToClipboard(props.detail).then(res => message.success('复制成功')).catch(err => message.error('复制失败'))
}

const onDeleteLicense = async (props) => {
  const [res, err] = await deleteLicense({ id: props.id });
  if (err) {
    message.error('出错啦');
  }
  tableRef.value.requestServerInteraction()
}

const onAddLicense = async () => {
  const [res, err] = await addLicense();
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
