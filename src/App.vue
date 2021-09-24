<template>
  <div id="app">
    <div class="top-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  /* width: 800px; */
  width: 100%;
  margin: auto;
  color: #2c3e50;
  /* margin-top: 60px; */
}

/* エラーメッセージを赤字に設定 */
.error {
  color: red;
}
</style>
