<template>
  <div class="row">
    <div class="col-md-12">
      <div class="row">
        <form action="#" class="col-md-6">
          <div class="form-group">
            <label class="floatLeft">Raw Tx:</label>
            <textarea class="form-control" v-model="rawTx" rows="9" cols="50"></textarea>
          </div>
          <div class="form-group">
            <label class="floatLeft">Private :</label>
            <input type="text" v-model="privateKey"  placeholder="Spender private key" class="form-control" />
          </div>
          <div class="form-group floatLeft">
            <button
              type="button"
              data-toggle="modal"
              ref="encrypt"
              @click="signTx()"
              class="btn btn-primary"
            >Sign Tx</button>
          </div>
        </form>
        <form action="#" class="col-md-6">
          <div class="form-group">
            <label class="floatLeft">Signed Tx:</label>
            <textarea class="form-control" v-model="signedTx" rows="9" cols="50"></textarea>
          </div>
          
        </form>
      </div>
    </div>
  </div>
</template>


<style scoped>
.floatLeft {
  float: left;
}

.floatRight {
  float: right;
}
</style>
<script>
const harmony = require("../../crypto-lib/harmony");

export default {
  name: "HashPage",
  data() {
    return {
      privateKey: "",
      rawTx: "",
      signedTx: "",
      txType:['staking','transaction']
    };
  },
  methods: {
    signTx(){
      harmony.signTx(
        this.privateKey,
        this.rawTx,
        'transaction'
        ).then(res=>{
            this.signedTx = res.rawTransaction
        })
    }
  },
  computed: {
    // hashtext: function() {
    //   return this.calculateHash();
    // },
    // ciphertext: function() {
    //   return this.operation("encrypt");
    // },
  }
};
</script>


