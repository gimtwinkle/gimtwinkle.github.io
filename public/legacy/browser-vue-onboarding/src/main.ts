// @ts-ignore: suppress missing type declarations for vue in this legacy project
import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
	render: (h: any) => h(App),
}).$mount('#app');
