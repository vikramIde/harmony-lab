<style scoped>
.floatLeft {
  float: left;
}
.fullWidth {
  width: 100%;
}
.fullbody {
  width: 500px;
}
</style>
<template>
  <div class="asymmetric">
    <div class="col-md-12">
      <div>
        <b-card >
          <b-card-body>
            <b-card-text>
              <div class="row">
                <form action="#" class="col-md-12">
                  <div class="form-group floatLeft">
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="generatekp()"
                    >Generate Keypair</button>
                  </div>
                </form>
              </div>
              <div class="row">
                <form action="#" class="col-md-12">
                  <div class="form-group">
                    <table class="table table-bordered">
                      <tr>
                        <th>Public Key</th>
                        <td>
                          <input type="text" style="width:100%" v-model="publickey" disabled />
                        </td>
                      </tr>
                      <tr>
                        <th>Private Key</th>
                        <td>
                          <input type="text" style="width:100%" v-model="privatekey" disabled />
                        </td>
                      </tr>
                    </table>
                  </div>
                </form>
              </div>
            </b-card-text>
          </b-card-body>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
const harmony = require("../../crypto-lib/harmony");

export default {
  name: "AssymetricPage",
  components: {},
  data() {
    return {
      publickey: "",
      privatekey: "",
      plaintext: "This is your secret message!",
      balance:0
    };
  },
  created() {},
  methods: {
    generatekp: function() {     
      harmony.generateKeyPair().then(res=>{
          this.publickey = res.address;
          this.privatekey = res.pvtKey;
      })
    }
  }
};
</script>
