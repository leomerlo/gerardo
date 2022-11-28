import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import MonthlyView from '@/views/Monthly.vue';

const localVue = createLocalVue()
localVue.use(Vuex);

describe('monthlyView', () => {  
  it('should not go past month 12', async () => {
    const push = jest.fn();
  
    const wrapper = shallowMount(MonthlyView, {
      localVue,
      mocks: {
        $router: {
          push
        }
      }
    })

    
    wrapper.vm.nextMonth(2022,12);

    await localVue.nextTick();
    
    expect(push).toHaveBeenCalledWith({
      name: "MonthlyView",
      params: {"month": 1, "year": 2023}
    })
  });

  it('should not go below month 1', async () => {
    const push = jest.fn();
  
    const wrapper = shallowMount(MonthlyView, {
      localVue,
      mocks: {
        $router: {
          push
        }
      }
    })

    
    wrapper.vm.prevMonth(2022,1);

    await localVue.nextTick();
    
    expect(push).toHaveBeenCalledWith({
      name: "MonthlyView",
      params: {"month": 12, "year": 2021}
    })
  });
    
    

});