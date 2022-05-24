<template>


  <div class="menu">
    <a v-for="아무렇게나작명 in 메뉴들" :key="아무렇게나작명">{{아무렇게나작명}}</a>
  </div>

  <img alt="Vue logo" src="./assets/logo.png">

  <a v-for="menu in 3" :key="menu">home</a>


  <div>
    <h4>{{products[0]}}</h4>
    <p>{{price[0]}}</p>
  </div>
  <div>
    <h4>{{products[1]}}</h4>
    <p>{{price[1]}}</p>
  </div>
  <div>
    <h4>{{products[2]}}</h4>
    <p>{{price[2]}}</p>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  data(){
    return{
      메뉴들 : ['home', 'shop', 'about'],
      products : ['역삼동원룸', '천호동원룸', '마포구원룸'],
      price : [100, 200, 300],
    };
  },
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.menu{
  background:darkslateblue;
  padding:15px;
  border-radius:5px;
}
.menu a{
  color:#fff;
  padding:10px;
}
</style>
