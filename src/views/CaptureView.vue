<template>
  <div class="container-fluid d-flex flex-column c-home">
    <div class="row">
      <div class="col">
        <div class=" text-center" v-show="!showPreview">

          <pre class="mb-4">{{ now | moment("HH:mm:ss") }}</pre>

          <div class="input-group mb-4">
            <div class="custom-file">
              <input
                type="file"
                class="custom-file-input"
                id="fileupload"
                ref="file"
                v-on:change="handleFilePreview()"
              />
              <label class="custom-file-label bg-primary text-white" for="fileupload">
                <b-icon-plus></b-icon-plus> Add Asset
              </label>
            </div>
          </div>
        </div>

        <div v-show="showPreview">

          <div class="card mb-4">
            <div class="card-body">
              <img :src="imagePreview" class="img-fluid" />
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" v-on:click.prevent="handleFileUpload">Upload</button>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CaptureView",
  components: {},
  data: function () {
    return {
      imagePreview: "",
      showPreview: false,
      now: 0,
      time: 0
    };
  },
  created: function () {
    let context = this
    context.now = Date.now();
    setInterval(function () {
      context.now = Date.now()
    }, 1000);
  },
  methods: {
    handleFileUpload: function () {
      let formData = new FormData();

      /*
        Add the form data we need to submit
      */
      formData.append('file', this.file)
      formData.append('time', this.time)

      /*
        Make the request to the POST /single-file URL
      */
      this.axios.post( '/add-marker',
        formData,
        {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
        }
      ).then(function(){
        // console.log('SUCCESS!!')
      })
      .catch(function(){
        // console.log('FAILURE!!')
      });
    },
    handleFilePreview: function() {
      this.file = this.$refs.file.files[0]
      this.time = this.now

      let reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          this.showPreview = true
          this.imagePreview = reader.result
        }.bind(this),
        false
      );

      if (this.file) {
        if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
          reader.readAsDataURL(this.file)
        }
      }
    }
  },
  computed: {
  }
};
</script>

<style lang="scss">
.custom-file-label {
  &:after {
    display: none;
  }
}
</style>

