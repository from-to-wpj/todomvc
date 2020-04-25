(function (Vue) {
	// 本地存储
	var STORAGE_KEY = 'myItems';
	const itemStorage = {
		fetch: function () {
			// 获取本地数据
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
			
		},
		save: function (items) {
			// 存储本地数据
			
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
		}
	}

	//初始化任务
	const items = [
		// {
		// 	id: 1,
		// 	content: 'vue.js',
		// 	completed: false //是否完成
		// },
		// {
		// 	id: 2,
		// 	content: 'java',
		// 	completed: true
		// },
		// {
		// 	id: 3,
		// 	content: 'pyhton',
		// 	completed: false
		// }
	]
	Vue.directive('app-focus', {
		inserted(el) {
			// console.log(el,binding);
			el.focus()
		}
	})

	var app = new Vue({
		el: '#todoapp',
		data: {
			// items,
			items: itemStorage.fetch(),//获取本地数据
			currentItem: null,//当前点击数据
			filterStatus: 'all'//hash状态
		},
		watch: {
			items: {
				deep: true, // 发现对象内部值的变化, 要在选项参数中指定 deep: true。
				handler: function (newItems, oldItems) {
					//本地进行存储
					// console.log('监听',newItems);		
					itemStorage.save(newItems)
				}

			}
		},
		directives: {
			// 全局指令
			'todo-focus': {
				update(el, binding) {
					if (binding.value) {
						el.focus()
					}
				}
			}
		},
		computed: {
			// 计算属性
			remaining() {
				return this.items.filter(item => !item.completed).length
			},
			toggleAll: {
				// 双向绑定
				get() {
					// console.log(this.remaining);
					return this.remaining === 0;
				},
				set(newStatus) {
					// 自定义
					this.items.forEach((item) => {
						item.completed = newStatus
					})
				}
			},
			filterItems() {
				//hash路由过滤数据
				switch (this.filterStatus) {
					case 'active':
						return this.items.filter(item => !item.completed)
						break;
					case 'completed':
						return this.items.filter(item => item.completed)
						break;
					default:
						return this.items
				}
			}
		},
		methods: {
			addItem(event) {
				// console.log(event.target.value);
                // 添加
				const content = event.target.value.trim();
				if (!content.length) {
					return
				}
				const id = this.items.length + 1;
				console.log(typeof(this.items),this.items);
			
				this.items.push({
					id,
					content,
					completed: false
				});
				event.target.value = '';	
			
			},
			removeItem(index) {
				// 删除
				this.items.splice(index, 1)
			},
			removeCompleted() {
				// 删除已完成
				this.items = this.items.filter(item => !item.completed)
			},
			toEdit(item) {
                // 编辑
				this.currentItem = item
			},
			cancelEdit() {
				// 关闭编辑
				this.currentItem = null
			},
			finishEdit(item, index, event) {
				// 完成编辑
				console.log(item, index, event);

				const content = event.target.value.trim();
				if (!content) (
					this.removeItem(index)

				);
				item.content = content
				this.currentItem = null
			}
		},

	});

	(window.onhashchange = function () {
		const hash = window.location.hash.substr(2) || 'all'
		console.log(window.location.hash, hash);
		// 路由hash
		app.filterStatus = hash
	})()
	// window.onhashchange()

})(Vue);
