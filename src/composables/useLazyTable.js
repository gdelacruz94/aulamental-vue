import { reactive, ref, watch } from 'vue'

export function useLazyTable(loadDataFn) {
  const data = ref([])
  const totalRecords = ref(0)

  const lazyParams = reactive({
    page: 0,
    rows: 10
  })

  const search = ref('')
  const dt = ref(null)

  const load = async () => {
    try {
      const { page, rows } = lazyParams
      const result = await loadDataFn(page, rows, search.value)
      data.value = result.content
      totalRecords.value = result.totalElements
    } catch (err) {
      console.error('Error al cargar datos:', err)
    }
  }

  function onPage({ page, rows }) {
    lazyParams.page = page
    lazyParams.rows = rows
    load()
  }
  

  function onSearch(e) {
    search.value = e.target.value
    lazyParams.page = 0
    load()
  }

  function exportCSV() {
    dt.value?.exportCSV()
  }

  watch([() => lazyParams.page, () => lazyParams.rows, search], load, {
    immediate: true
  })

  return {
    dt,
    data,
    totalRecords,
    lazyParams,
    search,
    onPage,
    onSearch,
    exportCSV,
    lazyLoad: load 
  }
}
