<template>
	<view class="h-100% w-100% position-relative">
		<view id="bpmnCanvas" class="process-viewer w-100% h-100%" :prop="xml" :change:prop="bpmnCanvas.handleXmlChange"
			:view-prop="view" :change:view-prop="bpmnCanvas.handleViewChange" @touchstart="bpmnCanvas.handleTouchStart"
			@touchmove="bpmnCanvas.handleTouchMove" @touchend="bpmnCanvas.handleTouchEnd" />
		<view
			class="absolute index-8 top-0 right-0 bg-#fff flex justify-center items-center gap-32rpx px-16rpx py-16rpx rounded-8px"
			style="z-index: 10">
			<view @click="bpmnCanvas.zoomOut()"> <wd-icon name="decrease" /> </view>
			<view @click="bpmnCanvas.zoomIn()"> <wd-icon name="add" /> </view>
			<view @click="bpmnCanvas.zoomReset()"> <wd-icon name="refresh" /> </view>
		</view>
	</view>
</template>

<script setup>
	import "./theme/index.scss";
	const props = defineProps({
		xml: {
			type: String,
			required: true
		},
		view: {
			type: Object,
			require: true
		}
	});
</script>
<script lang="renderjs" module="bpmnCanvas">
	import BpmnViewer from "bpmn-js/lib/Viewer";
	import {
		BpmProcessInstanceStatus
	} from '@/utils/constants'
	import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";

	export default {
		props: ['xml', 'view'],
		data() {
			return {
				bpmnViewer: null,
				processInstance: null,
				tasks: null,
				currentXml: '',
				currentView: null,
				imageUrl: '',

				// 缩放相关
				defaultZoom: 1,
				touchDistance: 0,
				lastZoom: 1,

				// 拖动相关
				isDragging: false,
				lastTouchX: 0,
				lastTouchY: 0,
				lastScrollX: 0,
				lastScrollY: 0,

				// 固定Y轴位置
				fixedY: 0,

				// 视图尺寸
				viewWidth: 0,
				viewHeight: 0

			}
		},

		methods: {
			// 监听 xml 变化
			handleXmlChange(newVal) {
				// console.log("🚀 ~ newVal:", newVal)
				this.currentXml = newVal;
				if (this.bpmnViewer) {
					this.initPage();
				} else {
					// 如果 viewer 还没初始化，等一会再试
					setTimeout(() => {
						if (!this.bpmnViewer && this.currentXml) {
							this.initPage();
						}
					}, 500);
				}
			},
			// 监听 view 变化
			handleViewChange(newVal) {
				// console.log("🚀 ~ newVal:", newVal)
				if (newVal && typeof newVal === 'string') {
					try {
						this.currentView = JSON.parse(newVal);
					} catch (e) {
						this.currentView = newVal;
					}
				} else {
					this.currentView = newVal;
				}

				if (this.bpmnViewer && this.currentView) {
					this.initPage()
				}
			},
			async initPage() {
				this.bpmnViewer && this.bpmnViewer.destroy();
				this.bpmnViewer = new BpmnViewer({
					additionalModules: [MoveCanvasModule],
					container: document.getElementById('bpmnCanvas'),
				});
				try {
					await this.bpmnViewer.importXML(this.xml || this.currentXml || this.currentView.bpmnXml);
					if (!this.bpmnViewer) return;
					const canvas = this.bpmnViewer.get("canvas");
					canvas.zoom("fit-viewport", "auto");

				} catch (err) {
					console.log("🚀 ~ err:", err)
				} finally {
					this.setProcessStatus(this.view || this.currentView);
				}
			},

			/** 高亮流程 */
			setProcessStatus(view) {
				// 设置相关变量
				if (!view || !view.processInstance) {
					return
				}
				this.processInstance = view.processInstance
				this.tasks = view.tasks
				if (!this.bpmnViewer) {
					return
				}
				const {
					unfinishedTaskActivityIds,
					finishedTaskActivityIds,
					finishedSequenceFlowActivityIds,
					rejectedTaskActivityIds
				} = view
				const canvas = this.bpmnViewer.get('canvas')
				const elementRegistry = this.bpmnViewer.get('elementRegistry')

				// 已完成节点
				if (Array.isArray(finishedSequenceFlowActivityIds)) {
					finishedSequenceFlowActivityIds.forEach((item) => {
						if (item != null) {
							canvas.addMarker(item, 'success')
							const element = elementRegistry.get(item)
							const conditionExpression = element.businessObject.conditionExpression
							if (conditionExpression) {
								canvas.addMarker(item, 'condition-expression')
							}
						}
					})
				}
				if (Array.isArray(finishedTaskActivityIds)) {
					finishedTaskActivityIds.forEach((item) => canvas.addMarker(item, 'success'))
				}

				// 未完成节点
				if (Array.isArray(unfinishedTaskActivityIds)) {
					unfinishedTaskActivityIds.forEach((item) => canvas.addMarker(item, 'primary'))
				}

				// 被拒绝节点
				if (Array.isArray(rejectedTaskActivityIds)) {
					rejectedTaskActivityIds.forEach((item) => {
						if (item != null) {
							canvas.addMarker(item, 'danger')
						}
					})
				}

				// 特殊：处理 end 节点的高亮。因为 end 在拒绝、取消时，被后端计算成了 finishedTaskActivityIds 里
				if (
					[BpmProcessInstanceStatus.CANCEL, BpmProcessInstanceStatus.REJECT].includes(
						this.processInstance.status
					)
				) {
					const endNodes = elementRegistry.filter((element) => element.type === 'bpmn:EndEvent')
					endNodes.forEach((item) => {
						canvas.removeMarker(item.id, 'success')
						if (this.processInstance.status === BpmProcessInstanceStatus.CANCEL) {
							canvas.addMarker(item.id, 'cancel')
						} else {
							canvas.addMarker(item.id, 'danger')
						}
					})
				}
			},
			// 放大
			zoomIn() {
				if (!this.bpmnViewer) return;
				const canvas = this.bpmnViewer.get('canvas');
				const currentZoom = canvas.zoom();
				const newZoom = currentZoom + 0.2;

				if (newZoom <= 3) {
					canvas.zoom(newZoom);
					this.zoomLevel = Math.round(newZoom * 100);

				}
			},

			// 缩小
			zoomOut() {
				if (!this.bpmnViewer) return;
				const canvas = this.bpmnViewer.get('canvas');
				const currentZoom = canvas.zoom();
				const newZoom = currentZoom - 0.2;

				if (newZoom >= 0.3) {
					canvas.zoom(newZoom);
					this.zoomLevel = Math.round(newZoom * 100);

				}
			},

			// 重置缩放
			zoomReset() {
				if (!this.bpmnViewer) return;
				const canvas = this.bpmnViewer.get("canvas");
				canvas.zoom("fit-viewport", "auto");

			},

			// ==================== 手指横向滑动 ====================

			// 触摸开始
			handleTouchStart(event) {
				const touches = event.touches;

				if (touches.length === 1) {
					// 单指：开始拖动
					this.isDragging = true;
					this.lastTouchX = touches[0].clientX;
					this.lastTouchY = touches[0].clientY;

					// 记录当前视图位置
					if (this.bpmnViewer) {
						const canvas = this.bpmnViewer.get('canvas');
						const viewbox = canvas.viewbox();
						this.lastScrollX = viewbox.x;
						this.lastScrollY = viewbox.y;
						this.fixedY = viewbox.y;
					}
				}
			},

			// 触摸移动
			handleTouchMove(event) {
				if (!this.isDragging || !this.bpmnViewer) return;

				const touches = event.touches;
				if (touches.length !== 1) return;

				//   event.preventDefault();

				const touch = touches[0];
				const deltaX = touch.clientX - this.lastTouchX;

				const canvas = this.bpmnViewer.get('canvas');
				const viewbox = canvas.viewbox();

				// 只计算横向移动，纵向保持固定
				const newX = this.lastScrollX - deltaX * viewbox.scale;

				// 限制横向拖动范围
				const boundedX = this.getBoundedX(newX);

				canvas.viewbox({
					x: boundedX,
					y: this.fixedY,
					width: viewbox.width,
					height: viewbox.height
				});
			},

			// 触摸结束
			handleTouchEnd() {
				this.isDragging = false;
			},

			// ==================== 辅助方法 ====================

			// 限制横向范围
			getBoundedX(x) {
				if (!this.bpmnViewer) return x;

				const canvas = this.bpmnViewer.get('canvas');
				const viewbox = canvas.viewbox();

				// 获取流程图元素
				const elementRegistry = this.bpmnViewer.get('elementRegistry');
				const elements = elementRegistry.getAll();

				// 计算流程图横向边界
				let minX = Infinity,
					maxX = -Infinity;

				elements.forEach(element => {
					if (element.x !== undefined) {
						minX = Math.min(minX, element.x);
						maxX = Math.max(maxX, element.x + (element.width || 50));
					}
				});

				// 如果没有元素，返回原位置
				if (minX === Infinity) {
					return x;
				}

				// 添加边距
				const padding = 50;
				minX -= padding;
				maxX += padding;

				// 计算可拖动横向范围
				const contentWidth = maxX - minX;
				const viewWidth = viewbox.width * viewbox.scale;

				// 限制 x 范围
				let boundedX = x;
				if (contentWidth > viewWidth) {
					boundedX = Math.max(minX, Math.min(maxX - viewWidth, x));
				} else {
					boundedX = minX + (contentWidth - viewWidth) / 2;
				}

				return boundedX;
			},

		}
	}
</script>