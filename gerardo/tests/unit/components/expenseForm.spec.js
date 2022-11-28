import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import expenseForm from '@/components/expenseForm.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
localVue.use(FontAwesomeIcon);

/*
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ blue: { value_sell: 100 }}),
  })
);
*/

describe('expenseForm', () => {
  let state, getters, actions, store, baseExpense;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    baseExpense = {
      id: '1',
      month: 2,
      name: 'Expense',
      value: 100,
      recurrentId: null,
      disabled: null,
      paid: false,
    };
    getters = {
      getUser: jest.fn().mockReturnValue({
        uid: 1
      }),
    }
    actions = {
      addExpense: jest.fn(),
      updateExpense: jest.fn(),
    },
    store = new Vuex.Store({
      state,
      getters,
      actions,
    });
  });

  describe('submitExpense', () => {

    it.skip('should run addExpense if it is not in edit mode', async () => {
      const wrapper = shallowMount(expenseForm, {
        store,
        localVue,
        propsData: {
          month: 1,
          expense: {},
          mode: 'add'
        },
        data: () => {
          return {
            expenseData: {
              id: null,
              name: baseExpense.name,
              value: baseExpense.value,
              month: baseExpense.month,
              recurrent: baseExpense.recurrent,
              uid: 1
            }
          }
        }
      });

      wrapper.vm.submitExpense();

      expect(actions.addExpense).toHaveBeenCalled();
      
    });

    it('should run updateExpense if it is in edit mode', () => {
      const wrapper = shallowMount(expenseForm, {
        store,
        localVue,
        propsData: {
          month: 1,
          expense: {},
          mode: 'edit'
        },
        data: () => {
          return {
            expenseData: {
              id: null,
              name: baseExpense.name,
              value: baseExpense.value,
              month: baseExpense.month,
              recurrent: baseExpense.recurrent,
              uid: 1
            }
          }
        }
      });

      wrapper.vm.submitExpense();

      expect(actions.updateExpense).toHaveBeenCalled();
      
    });
  });

  describe('addExpense', () => {
    it('should return a formError if its missing a required field', () => {
      const wrapper = shallowMount(expenseForm, {
        store,
        localVue,
        propsData: {
          month: 1,
          expense: {},
          mode: 'add'
        },
        data: () => {
          return {
            expenseData: {
              recurrent: true,
              name: '',
              value: '',
              month: '',
            }
          }
        }
      });

      wrapper.vm.expenseData.month = '';

      wrapper.vm.addExpense();
      expect(wrapper.vm.formError.error).toBeTruthy();
      expect(wrapper.vm.formError.message).toEqual('Hay campos requeridos vacios');

      wrapper.vm.expenseData.name = 'Name';

      wrapper.vm.addExpense();
      expect(wrapper.vm.formError.error).toBeTruthy();
      expect(wrapper.vm.formError.message).toEqual('Hay campos requeridos vacios');

      wrapper.vm.expenseData.value = 100;

      wrapper.vm.addExpense();
      expect(wrapper.vm.formError.error).toBeTruthy();
      expect(wrapper.vm.formError.message).toEqual('Hay campos requeridos vacios');

      wrapper.vm.expenseData.month = 1;

      wrapper.vm.submitExpense();
      expect(wrapper.vm.formError.error).toBeFalsy();
    });

    it('should return a formError if its recurrent and month is not within range', () => {
      const wrapper = shallowMount(expenseForm, {
        store,
        localVue,
        propsData: {
          month: 1,
          expense: {},
          mode: 'add'
        },
        data: () => {
          return {
            expenseData: {
              id: null,
              name: baseExpense.name,
              value: baseExpense.value,
              month: 13,
              recurrent: baseExpense.recurrent,
              uid: 1,
            }
          }
        }
      });

      localVue.nextTick();

      wrapper.vm.expenseData.name = 'A';
      wrapper.vm.expenseData.value = '100';

      wrapper.vm.addExpense();
      expect(wrapper.vm.formError.error).toBeTruthy();
      expect(wrapper.vm.formError.message).toEqual('El mes está fuera de rango');
    });

    it('should clear the month on recurrent expenses', () => {
      
    });

    it('should dispatch the addExpense action', () => {
      
    });

    it('should emit the createdExpense event', () => {
      
    });
  });

  describe('updateExpense', () => {
    it('should unlink the expense coming from a recurrent', () => {
      const updateExpense = {
        ...baseExpense,
        linked: true,
        recurrentId: 1,
        uid: 1
      }
      const wrapper = shallowMount(expenseForm, {
        store,
        localVue,
        propsData: {
          expenses: []
        },
        data: () => {
          return {
            expenseData: updateExpense
          }
        }
      });

      wrapper.vm.updateExpense();
      expect(!wrapper.vm.linked).toBeTruthy();
    });

    it('should dispatch the updateExpense action', () => {
      const updateExpense = {
        ...baseExpense,
        uid: 1
      }
      const wrapper = shallowMount(expenseForm, {
        store,
        localVue,
        propsData: {
          expenses: []
        },
        data: () => {
          return {
            expenseData: updateExpense
          }
        }
      });

      wrapper.vm.updateExpense();
      expect(actions.updateExpense).toHaveBeenCalled();
    });

    it('should emit the updatexExpense event', () => {
      const updateExpense = {
        ...baseExpense,
        uid: 1
      }
      const wrapper = shallowMount(expenseForm, {
        store,
        localVue,
        propsData: {
          expenses: []
        },
        data: () => {
          return {
            expenseData: updateExpense
          }
        }
      });

      wrapper.vm.updateExpense();
      expect(wrapper.emitted().updatedExpense[0]).toEqual([updateExpense])
    });
  });

});