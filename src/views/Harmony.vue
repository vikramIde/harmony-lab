<template>
  <div class="home">
    <div class="col-md-8 centeralign">
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
            <SignTx />
          </b-tab>
          <b-tab title="Decode">
            <DecodeTx />
          </b-tab>
          <b-tab title="Send">
            <SendTx />
          </b-tab>
          <b-tab title="Contract">
          </b-tab>
        </b-tabs>
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
import SignTx from "@/components/harmony/SignTx.vue";
import SendTx from "@/components/harmony/SendTx.vue";
import DecodeTx from "@/components/harmony/Decode.vue";
import Introduction from "@/components/harmony/Introduction.vue";
export default {
  name: "PanelPage",
  components: {
    Wallet,
    BuildTx,
    SignTx,
    SendTx,
    DecodeTx,
    Introduction
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
