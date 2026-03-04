<template>
  <ProcessViewer
    key="designer"
    :xml="modelView.bpmnXml"
    :view="modelView"
    class="process-viewer"
  />
</template>

<script lang="ts" setup>
import ProcessViewer from "./ProcessViewer.vue";

defineOptions({ name: "BpmProcessInstanceBpmnViewer" });

const props = defineProps({
  bpmnXml: { type: String }, // BPMN XML
  modelView: { type: Object }
});

const view = ref({
  bpmnXml: ""
}); // BPMN 流程图数据

/** 只有 loading 完成时，才去加载流程列表 */
watch(
  () => props.modelView,
  async (newModelView) => {
    // 加载最新
    if (newModelView) {
      //@ts-ignore
      view.value = newModelView;
    }
  }
);

/** 监听 bpmnXml */
watch(
  () => props.bpmnXml,
  (value) => {
    view.value.bpmnXml = value;
  }
);
</script>

<style lang="scss" scoped>
.process-viewer {
  min-height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
