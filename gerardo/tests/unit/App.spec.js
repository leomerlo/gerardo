import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from '@/App.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex)

describe('App', () => {
  let actions, getters, store, router;

  beforeEach(() => {
    actions = {
      signOutUser: jest.fn()
    },
    getters = {
      getUser: jest.fn()
    },
    store = new Vuex.Store({
      actions,
      getters
    })
    router = new VueRouter()
  });

  it('dispatches the sign out action when click on the signout button', () => {
    const wrapper = shallowMount(App, { store, localVue, router });
    const input = wrapper.find('#signOut');
    console.warn(input);
  });
})
