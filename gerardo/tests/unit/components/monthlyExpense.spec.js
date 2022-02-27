import { shallowMount, createLocalVue } from '@vue/test-utils';
import { advanceTo } from 'jest-date-mock';
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import monthlyExpense from '@/components/monthlyExpense.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex)

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ blue: { value_sell: 100 }}),
  })
);

describe('monthlyExpense', () => {
  let state, getters, actions, store;

  beforeEach(() => {
    state = {
      expenses: [
        {
          id: "1",
          name: "Recurrente",
          recurrent: true,
          uid: "1",
          value: "0",
        },
        {
          id: "2",
          month: 1,
          name: "Mensual 1",
          recurrent: false,
          uid: "2",
          value: "0",
        },
        {
          id: "3",
          month: 2,
          name: "Mensual 2",
          recurrent: false,
          uid: "3",
          value: "0",
        }
      ]
    },
    getters = {
      allExpenses: () => state.expenses,
      nonRecurrentExpenses: () => state.expenses.filter((e) => !e.recurrent),
      recurrentExpenses: () => state.expenses.filter((e) => e.recurrent),
    },
    actions = {
      cloneExpense: jest.fn(),
    },
    store = new Vuex.Store({
      state,
      getters,
      actions,
    })
  });

  // Should be the first test so we can validate HaveBeenCalled
  it('should clone the recurrent expenses for the month', async () => {
    advanceTo(new Date(2022, 2, 27, 0, 0, 0));

    const wrapper = shallowMount(monthlyExpense, {
      store,
      localVue,
      propsData: {
        month: 5
      }
    });

    await localVue.nextTick();

    expect(actions.cloneExpense).toHaveBeenCalledTimes(1);
  });

  it('should return the expenses for the selected month', async () => {
    const wrapper = shallowMount(monthlyExpense, {
      store,
      localVue,
      propsData: {
        month: 1
      }
    });

    expect(wrapper.vm.allExpenses.length).toEqual(3);
    expect(wrapper.vm.expenseByMonth.length).toEqual(1);
  });

  it('should try to get exchangeValues on mounter', () => {
    
    const testGetExchangeValues = jest.spyOn(monthlyExpense.methods, 'getExchangeValues')

    const wrapper = shallowMount(monthlyExpense, {
      store,
      localVue,
      propsData: {
        month: 1
      },
    });

    expect(testGetExchangeValues).toHaveBeenCalled();

  });
});