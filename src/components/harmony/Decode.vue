<template>
  <div class="row">
    <div class="col-md-12">
      <div class="row">
        <form action="#" class="col-md-6">
          <div class="form-group">
            <label class="floatLeft">Raw Signed Tx:</label>
            <textarea class="form-control" v-model="rawTx" rows="9" cols="50"></textarea>
          </div>
          
          <div class="form-group floatLeft">
            <button
              type="button"
              data-toggle="modal"
              ref="encrypt"
              @click="decodeTx()"
              class="btn btn-primary"
            >Decode Tx</button>
          </div>
        </form>
        <form action="#" class="col-md-6">
          <div class="form-group">
            <label class="floatLeft">Decoded Tx:</label>
            <textarea class="form-control" v-model="decodedTx" rows="9" cols="50"></textarea>
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
      decodedTx: "",
      txType:['staking','transaction']
    };
  },
  methods: {
    decodeTx(){
      harmony.decodex(
        this.rawTx,
        ).then(res=>{
            console.log(res)
            this.decodedTx = JSON.stringify(res)
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


