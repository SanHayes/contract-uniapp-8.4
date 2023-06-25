import App from './App'
import i18n from './locale'
import store from "./store";
import * as filters from '@/filters';

if (process.env.NODE_ENV !== 'development') {
	// eslint-disable-next-line no-console
	console.log(
		` %c contract-uniapp  %c LastBuildTime: ${__APP_INFO__['build_time']},commit:${__APP_INFO__['commit']} `,
		'color: #fadfa3; background: #030307; padding:5px 0;',
		'background: #fadfa3; padding:5px 0;'
	)
}

// #ifndef VUE3
import Vue from 'vue'

import uView from "uview-ui";
Vue.use(uView);

//过滤器批量注册
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false
App.mpType = 'app'

try {
	function isPromise(obj) {
		return (
			!!obj &&
			(typeof obj === "object" || typeof obj === "function") &&
			typeof obj.then === "function"
		);
	}

	// 统一 vue2 API Promise 化返回格式与 vue3 保持一致
	uni.addInterceptor({
		returnValue(res) {
			if (!isPromise(res)) {
				return res;
			}
			return new Promise((resolve, reject) => {
				res.then((res) => {
					if (res[0]) {
						reject(res[0]);
					} else {
						resolve(res[1]);
					}
				});
			});
		},
	});
} catch (error) {}

const app = new Vue({
	i18n,
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif