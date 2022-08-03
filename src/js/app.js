const Home = { template: '<div>Home</div>' };
const About = { template: '<div>About</div>' };

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
];

const router = new VueRouter({
  routes,
});

const app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  router,
  data: {
    message: 'Hello Vue!',
  },
});

Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
