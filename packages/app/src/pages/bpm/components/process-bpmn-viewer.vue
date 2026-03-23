<template>
  <ProcessViewer
    key="designer"
    :xml="modelView.bpmnXml"
    :view="modelView"
    class="process-viewer"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import ProcessViewer from './process-viewer/index.vue'

defineOptions({ name: 'BpmProcessBpmnViewer' })

const props = defineProps({
  bpmnXml: { type: String },
  modelView: { type: Object },
})

const view = ref({
  bpmnXml: '',
})

watch(
  () => props.modelView,
  async (newModelView) => {
    if (newModelView) {
      // @ts-ignore
      view.value = newModelView
    }
  },
)

watch(
  () => props.bpmnXml,
  (value) => {
    view.value.bpmnXml = value || ''
  },
)
</script>

<style lang="scss" scoped>
.process-viewer {
  min-height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
