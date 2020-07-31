<template>
  <div class="row">
    <div class="col-md-6">
      <div class="blog">
        <ul>
          <li>
            <a
              href="https://github.com/Vishwas1/crypto/blob/master/docs/README.md"
              target="_blank"
            >Basic concept of Harmony wallet</a>
            <ul>
              <li>Create Account</li>
              <li>Build Transaction</li>
              <li>Sign Transaction</li>
              <li>Decode Transaction</li>
              <li>Send Transaction</li>
              <li>Contract Editor</li>
            </ul>
          </li>
          <li>
            Uses following libraries
            <ul>
              <li>
                <a href="https://github.com/harmony-one/sdk" target="_blank"> Harmony Js SDK </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="https://github.com/vikramIde/harmony-lab" target="_blank">Source Code</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="col-md-6">
      <p>
        <h5>Encourage me by giving this repo a <b>star</b>! :)</h5>
      </p>
      <div
        class="github-card"
        data-github="vikramIde/harmony-lab"
        data-width="400"
        data-height
        data-theme="default"
      ></div>
    </div>
  </div>
</template>
<style scoped>
.blog {
  text-align: left;
  padding: 10px;
  height: 500px;
  overflow-y: auto;
}
</style>
<script>
export default {
  name: "IntroductionPage",
  data() {
    return {};
  },
  created() {
    let ckeditor = document.createElement("script");
    ckeditor.setAttribute(
      "src",
      "//cdn.jsdelivr.net/github-cards/latest/widget.js"
    );
    document.head.appendChild(ckeditor);
  }
};
</script>