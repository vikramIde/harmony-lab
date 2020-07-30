<template>
  <div class="home">
    <div class="col-md-8 centeralign">
      <b-card no-body style="padding: 20px">
        <b-tabs content-class="mt-3">
          <b-tab title="Introduction" active>
            <Introduction/>
          </b-tab>
          <b-tab title="Account">
            <Wallet />
          </b-tab>
          <b-tab title="Build Tx">
            <BuildTx />
          </b-tab>
          <b-tab title="Sign Tx">
            <Asymmetric />
          </b-tab>
          <b-tab title="Decode">
            <ZKP />
          </b-tab>
          <b-tab title="Send">
            <ZKP />
          </b-tab>
          <b-tab title="Contract">
            <ZKP />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>
<style scoped>
.addmargin {
  margin-top: 10px;
  margin-bottom: 10px;
}

.vue-logo-back {
  background-color: black;
}

.logo {
  width: 144px;
}

.fullbody {
  width: 100%;
}

</style>
<script>
import Wallet from "@/components/harmony/Wallet.vue";
import BuildTx from "@/components/harmony/BuildTx.vue";
import Asymmetric from "@/components/Asymmetric.vue";
import Symmetric from "@/components/Symmetric.vue";
import Introduction from "@/components/harmony/Introduction.vue";
import ZKP from "@/components/zkp.vue";
export default {
  name: "PanelPage",
  components: {
    Wallet,
    BuildTx,
    Symmetric,
    Introduction,
    ZKP
  },
  data() {
    return {
      active: 0
    };
  },
  created() {},
  methods: {
    gotosubpage: id => {
      this.$router.push(`${id}`);
    }
  }
};
</script>
