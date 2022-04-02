import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { advanceTo } from 'jest-date-mock';
import expenseListItem from '@/components/expenseListItem.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

/*
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ blue: { value_sell: 100 }}),
  })
);
*/

describe('expenseListItem', () => {
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
      nonRecurrentExpenses: jest.fn().mockReturnValue([
        {
          ...baseExpense,
          month: 2,
          id: 1,
        },
        {
          ...baseExpense,
          month: 1,
          id: 2,
        },
        {
          ...baseExpense,
          month: 1,
          id: 3,
        },
        {
          ...baseExpense,
          month: 3,
          id: 4,
        }
      ])
    };
    actions = {
      deleteExpense: jest.fn(),
      disableExpense: jest.fn(),
      enableExpense: jest.fn(),
      unlinkExpense: jest.fn(),
      updateExpense: jest.fn(),
    },
    store = new Vuex.Store({
      state,
      getters,
      actions,
    });
  });

  describe('editExpense', () => {
    it('should set the mode to edit', async () => {
      const wrapper = shallowMount(expenseListItem, {
        localVue,
        propsData: {
          expense: baseExpense,
        }
      });
      wrapper.vm.editExpense(baseExpense);
      expect(wrapper.vm.mode).toEqual('edit');
    });

    it('should emit an editExpense event', async() => {
      const wrapper = shallowMount(expenseListItem, {
        localVue,
        propsData: {
          expense: baseExpense,
        }
      });
      wrapper.vm.editExpense(baseExpense);
      expect(wrapper.emitted().editExpense[0]).toEqual([baseExpense])
    });
  });

  describe('updatedExpense', () => {
    it('should set the mode to list', () => {
      const wrapper = shallowMount(expenseListItem, {
        localVue,
        propsData: {
          expense: baseExpense,
        },
        data: () => {
          return {
            mode: 'edit',
          }
        }
      });
      expect(wrapper.vm.mode).toEqual('edit');
      wrapper.vm.updatedExpense(baseExpense);
      expect(wrapper.vm.mode).toEqual('list');
    });
  });

  describe('disableExpense', () => {
    it('should dispatch disableExpense', () => {
      const wrapper = shallowMount(expenseListItem, {
        store,
        localVue,
        propsData: {
          expense: baseExpense,
        }
      });
      wrapper.vm.disableExpense(baseExpense);
      expect(actions.disableExpense).toHaveBeenCalled();
    });
  });

  describe('enableExpense', () => {
    it('should dispatch enableExpense', () => {
      const wrapper = shallowMount(expenseListItem, {
        store,
        localVue,
        propsData: {
          expense: baseExpense,
        }
      });
      wrapper.vm.enableExpense(baseExpense);
      expect(actions.enableExpense).toHaveBeenCalled();
    });
  });

  describe('completeExpense', () => {
    it('should dispatch updateExpense', () => {
      const wrapper = shallowMount(expenseListItem, {
        store,
        localVue,
        propsData: {
          expense: baseExpense,
        }
      });
      wrapper.vm.completeExpense(baseExpense);
      expect(actions.updateExpense).toHaveBeenCalled();
    });
  });

  describe('updatedRecurrentDependencies', () => {
    it('should return false if it is not recurrent', () => {
      const nonRecurrentExpense = {
        ...baseExpense,
        recurrent: null
      }
      const wrapper = shallowMount(expenseListItem, {
        store,
        localVue,
        propsData: {
          expense: nonRecurrentExpense,
        }
      });
      
      expect(wrapper.vm.updatedRecurrentDependencies(nonRecurrentExpense)).toBeFalsy()
    });

    it('should update future linked expenses', () => {
      advanceTo(new Date(2022, 1, 1, 0, 0, 0));
      const recurrentExpense = {
          ...baseExpense,
          recurrent: true,
      }
      store = new Vuex.Store({
        state,
        getters: {
          nonRecurrentExpenses: jest.fn().mockReturnValue([
            {
              ...baseExpense,
              month: 2,
              id: 2,
              recurrentId: 1,
            },
            {
              ...baseExpense,
              month: 1,
              id: 3,
            },
            {
              ...baseExpense,
              month: 1,
              id: 4,
              recurrentId: 1,
            },
            {
              ...baseExpense,
              month: 3,
              id: 5,
              recurrentId: 1,
            },
            {
              ...baseExpense,
              month: 3,
              id: 6,
            },
          ])
        },
        actions,
      });
      const wrapper = shallowMount(expenseListItem, {
        store,
        localVue,
        propsData: {
          expense: recurrentExpense,
        }
      });

      wrapper.vm.updatedRecurrentDependencies(recurrentExpense);

      expect(actions.updateExpense).toHaveBeenCalledTimes(2)
    });

    it('should fail if it is not able to filter nonRecurrentExpenses', () => {
      const recurrentExpense = {
          ...baseExpense,
          recurrent: true,
      }
      store = new Vuex.Store({
        state,
        getters: {
          nonRecurrentExpenses: jest.fn().mockReturnValue(() => {
            return null
          }),
        },
        actions,
      });
      const wrapper = shallowMount(expenseListItem, {
        store,
        localVue,
        propsData: {
          expense: recurrentExpense,
        }
      });

      expect(() => {
        wrapper.vm.updatedRecurrentDependencies(recurrentExpense);
      }).toThrow("There was an issue updating the expense dependencies");
    });
  });

  describe('deleteExpense', () => {
    it('should not delete linked dependencies', () => {
      const noRecurrent = {
        ...baseExpense,
        recurrentId: 2
      }
      const wrapper = shallowMount(expenseListItem, {
        store,
        localVue,
        propsData: {
          expense: noRecurrent,
        }
      });
      expect(() => {
        wrapper.vm.deleteExpense(noRecurrent)
      }).toThrow('You can\'t eliminate linked dependencies');
    });

    it('should remove all future dependencies', () => {
      advanceTo(new Date(2022, 1, 1, 0, 0, 0));
      const wrapper = shallowMount(expenseListItem, {
        store,
        localVue,
        propsData: {
          expense: baseExpense,
        }
      });

      wrapper.vm.deleteExpense(baseExpense);

      expect(actions.deleteExpense).toHaveBeenCalledTimes(2);
    });

    it('should dispath unlinkExpense on older dependencies', () => {
      advanceTo(new Date(2022, 1, 1, 0, 0, 0));
      const wrapper = shallowMount(expenseListItem, {
        store,
        localVue,
        propsData: {
          expense: baseExpense,
        }
      });

      wrapper.vm.deleteExpense(baseExpense);

      expect(actions.unlinkExpense).toHaveBeenCalledTimes(3);
    });

    it('should dispath deleteExpense for the current expense', () => {
      const wrapper = shallowMount(expenseListItem, {
        store,
        localVue,
        propsData: {
          expense: baseExpense,
        }
      });

      wrapper.vm.deleteExpense(baseExpense);

      expect(actions.deleteExpense).toHaveBeenLastCalledWith(expect.any(Object), baseExpense.id);
    });

    it('should throw an error if it cant filter the nonRecurrentExpenses array', () => {
      store = new Vuex.Store({
        state,
        getters: {
          nonRecurrentExpenses: jest.fn().mockReturnValue(() => {
            return null
          }),
        },
        actions,
      });
      const wrapper = shallowMount(expenseListItem, {
        store,
        localVue,
        propsData: {
          expense: baseExpense,
        }
      });

      expect(() => {
        wrapper.vm.deleteExpense(baseExpense);
      }).toThrow("There was a problem removing the linking, please try again");
    });
  });
});