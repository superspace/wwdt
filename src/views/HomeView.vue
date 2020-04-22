<template>
  <div>
    <div class="container-fluid d-flex flex-column c-home">
      <controls></controls>
      <div class="row">
        <div class="col-md-9">
          <asset-editor></asset-editor>
          <marker-editor></marker-editor>
          <keyframe-editor></keyframe-editor>
          <timeline></timeline>
      <div class="row">
          <div class="col d-flex justify-content-end">
            <b-form inline class="p-1">
              <b-form-checkbox v-model="showActivity" switch>
                <small>
                  <strong>Activity</strong>
                </small>
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
            <div class="col">
              <b-tabs>
                <b-tab title="Arrangement" active>
                  <arrangement class="pt-3"></arrangement>
                </b-tab>
                <b-tab title="Marker">
                  <marker-list class="pt-3"></marker-list>
                </b-tab>
              </b-tabs>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <video-player></video-player>
          <prompter></prompter>
          <asset-list></asset-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Activity from "@/components/Activity";
import VideoPlayer from "@/components/VideoPlayer";
import Timeline from "@/components/Timeline";
import Arrangement from "@/components/Arrangement";
import Prompter from "@/components/Prompter";
import Controls from "@/components/Controls";
import AssetEditor from "@/components/AssetEditor";
import AssetList from "@/components/AssetList";
import MarkerList from "@/components/MarkerList";
import MarkerEditor from "@/components/MarkerEditor";
import KeyframeEditor from "@/components/KeyframeEditor";

export default {
  name: "HomeView",
  components: {
    Controls,
    Activity,
    VideoPlayer,
    MarkerEditor,
    MarkerList,
    AssetList,
    Timeline,
    Arrangement,
    Prompter,
    AssetEditor,
    KeyframeEditor
  },
  created: function() {},
  data: function() {
    return {
      showAssets: false,
      showActivity: false
    };
  },
  computed: {}
};
</script>

<style lang="scss">
.c-home {
  height: calc(100vh - 100px);
  overflow: scroll;
}
</style>

