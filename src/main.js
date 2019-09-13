import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import VueRouter from 'vue-router'

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.config.productionTip = false;

/* eslint-disable no-new */
import Login from './components/Login'
import Video from './components/Video'

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '',
            component: Login
        }, {
            path: '/index',
            component: Video
        }
    ]
});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});