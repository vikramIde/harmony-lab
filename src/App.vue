<style scoped>
.logo {
  /* width: 144px; */
  padding-top: 1.5%;
  padding-left: 25px;
}
.leftAlign {
  text-align: left;
}
</style>
<template>
  <div id="app">
    <div class="row">
      <div class="col-md-8 centeralign logo leftAlign">
        <!-- <h3><img class="logo" src="https://forum.aeternity.com/uploads/db0917/original/1X/543f494a818af66690a1298689af3fdd0c6389a1.png"> | Laboratory</h3> -->
        <h2>
          <img class="logo" src="https://assets.website-files.com/5ea98076e2f684f39f95888f/5ea98076e2f684fdc09588b9_harmony_logo.svg" /> 
          <span class="heading"> | Playground</span>
        </h2>
        <h6
          style="color:grey; font-style: italic;"
        >A simple tool to play and learn basic concepts of Harmony Blockchain!</h6>
        <hr style="opacity: 1.5" />
      </div>
    </div>
    <router-view />
  </div>
</template>

<style>

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: #000000;
  margin:0;
  padding:0;
  min-height: 100% !important;
  height: 100% !important;
  color:white;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.centeralign {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.heading {
  color:white;
  margin-top:10px;
}
</style>
