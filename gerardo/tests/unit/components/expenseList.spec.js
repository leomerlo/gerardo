import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import expenseList from '@/components/expenseList.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

/*
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ blue: { value_sell: 100 }}),
  })
);
*/

describe('expenseList', () => {
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

  describe('editExpense', () => {

    it('should emit the editExpense event', () => {
      const wrapper = shallowMount(expenseList, {
        store,
        localVue,
        propsData: {
          expenses: []
        },
      });

      wrapper.vm.editExpense(baseExpense);
      expect(wrapper.emitted().editExpense[0]).toEqual([baseExpense])
      
    });

  });

});