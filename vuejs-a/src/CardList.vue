<template>
    <div v-for="(room, i) in 원룸들" :key="i">
        <img :src="원룸들[i].image" alt="룸타입" class="room-img">
        <h4>{{원룸들[i].title}}</h4>
        <p>{{원룸들[i].content}}</p>
        <p>{{원룸들[i].price}}</p>
    </div>
</template>
<script>
export default {
    name : 'CardList',
    props :  {
        원룸들 : Array,
    },
}
</script>
<style>
    
</style>