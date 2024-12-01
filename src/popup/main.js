import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import Popup from '@/popup/popup.vue'
import router from './router'
import 'ant-design-vue/dist/reset.css';

const app = createApp(Popup)
app.use(Antd)
app.use(router)
app.mount('#app')
