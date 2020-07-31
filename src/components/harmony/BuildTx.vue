<template>
  <div class="row">
    <div class="col-md-12">
      <div class="row">
        <form action="#" class="col-md-6">
          <div class="form-group">
            <label class="floatLeft">Sender:</label>
            <input type="text" v-model="sender"  placeholder="Spender public key" class="form-control" />
          </div>
          <div class="form-group">
            <label class="floatLeft">Receiver:</label>
            <input type="text" v-model="reciever" placeholder="Reciever public key" class="form-control" />
          </div>
          <div class="form-group">
            <label class="floatLeft">Amount:</label>
            <input type="text" v-model="amount" placeholder="100" class="form-control" />
          </div>
          <div class="form-group">
            <label class="floatLeft">Payload:</label>
            <input type="text" v-model="payload" class="form-control" />
          </div>
          
          <div class="form-group floatLeft">
            <button
              type="button"
              data-toggle="modal"
              ref="encrypt"
              @click="buildTx()"
              class="btn btn-primary"
            >Build Tx</button>
          </div>
        </form>
        <form action="#" class="col-md-6">
          <div class="form-group">
            <label class="floatLeft">Raw Tx:</label>
            <textarea class="form-control" v-model="rawTx" rows="9" cols="50"></textarea>
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
      sender: "",
      reciever: "",
      amount: "",
      payload: "",
      rawTx: ""
    };
  },
  methods: {
    calculateHash: function() {
      return symmetric.sha256hashStr(this.plaintext);
    },
    buildTx(){
      harmony.buildTx(
        this.sender,
        this.reciever,
        this.amount
        ).then(res=>{
          let  [unsignedRawTransaction, raw] = res.getRLPUnsigned();
          
          this.rawTx = unsignedRawTransaction
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


