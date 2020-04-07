<template>
  <div>
    <b-sidebar id="sidebar-assets" v-model="showAssets" title="Assets" right shadow>
      <div class="px-2 py-2">
          <asset-list></asset-list>
      </div>
    </b-sidebar>
    <div class="container-fluid d-flex flex-column c-home"> 
      <controls></controls>
      <div class="row">
        <div class="col">
          <timeline></timeline>
        </div>
      </div>
      <div class="row">
        <div class="col d-flex justify-content-end">

          <b-form inline class="p-1">

            <b-form-checkbox switch v-model="showAssets" class="mr-3">
              <small><strong>Assets </strong></small>
            </b-form-checkbox>

            <b-form-checkbox v-model="showActivity" switch>
                <small><strong>Activity</strong></small>
            </b-form-checkbox>

          </b-form>

        </div>
      </div>
      <div class="row">
        <div class="col">
          <activity :visible="showActivity"></activity>
        </div>
      </div>
      <div class="row flex-grow-1">
        <div class="col-md-8">
          <arrangement></arrangement>
        </div>
        <div class="col-md-4">
          <video-player></video-player>
          <b-tabs>
            <b-tab title="Marker" active>
              <marker-editor class="pt-3"></marker-editor>
            </b-tab>
            <b-tab title="Transkript">
              <prompter></prompter>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Activity from '@/components/Activity'
import VideoPlayer from '@/components/VideoPlayer'
import MarkerEditor from '@/components/MarkerEditor'
import AssetList from '@/components/AssetList'
import Timeline from '@/components/Timeline'
import Arrangement from '@/components/Arrangement'
import Prompter from '@/components/Prompter'
import Controls from '@/components/Controls'

export default {
  name: 'HomeView',
  components: {
    Controls,
    Activity,
    VideoPlayer,
    MarkerEditor,
    AssetList,
    Timeline,
    Arrangement,
    Prompter
  },
  created: function () {
  },
  data: function () {
    return {
      showAssets: false,
      showActivity: false
    }
  },
  computed: {
  }
}
</script>

<style lang="scss">

.c-home {
  height: calc(100vh - 100px);
  overflow: scroll;
}

</style>

