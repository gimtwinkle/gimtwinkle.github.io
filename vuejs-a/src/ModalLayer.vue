<template lang="">
    <div class="black-bg" v-if = "모달창열렸니==true">
        <div class="white-bg">
          <h4>{{원룸들[선택값].title}}</h4>
          <img :src="원룸들[선택값].image" alt="룸타입" class="room-img">
          <p>{{원룸들[선택값].price}}</p>
          <p>{{원룸들[선택값].content}}</p>
          <!-- <button @click="모달창열렸니=false">닫기</button> -->
        </div>
      </div>
</template>
<script>
export default {
    name:'ModalLayer',
    props:{
        원룸들 : Array, //데이터 이름 : 받아온 데이터의 자료형 이름을 대문자로 시작작성
        선택값 : Number,
        모달창열렸니 : Boolean,
      }
}
</script>
<style>
    .black-bg{
        position:fixed;
        width:100%;
        height:100%;
        background:rgba(0, 0, 0, 0.5);
        text-align:center;
        }
        .white-bg{
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%, -50%);
        width:500px;
        height:500px;
        background:#fff;
        }
</style>