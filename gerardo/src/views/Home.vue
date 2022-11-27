<template>
    <div></div>
</template>

<script>
import router from '../router'
import moment from 'moment';

export default {
    name: 'HomePage',
    created() {
        const currentMonth = parseInt(moment(new Date).format('M'));
        const currentYear = parseInt(moment(new Date).format('Y'));
        router.push({ name: 'MonthlyView', params: { year: currentYear, month: currentMonth }})
    }
}
</script>