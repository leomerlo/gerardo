<template>
    <div></div>
</template>

<script>
import router from '../router'
import moment from 'moment';

export default {
    name: 'HomePage',
    created() {
        const currentMonth = parseInt(moment(new Date).add(this.monthTracker, 'months').format('M'));
        router.push({ name: 'MonthlyView', params: { month: currentMonth }})
    }
}
</script>