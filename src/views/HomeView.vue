<template>
  <div class="container-fluid d-flex flex-column c-home"> 
    <controls></controls>
    <div class="row">
      <div class="col">
        <timeline></timeline>
        <activity></activity>
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
            <br>
            <marker-editor></marker-editor>
          </b-tab>
          <b-tab title="Transkript">
            <br>
            <prompter></prompter>
          </b-tab>
          <b-tab title="Assets">
            <br>
            <asset-list></asset-list>
          </b-tab>
        </b-tabs>
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

