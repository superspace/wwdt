<template>
  <div v-if="session.id">
    <asset-editor></asset-editor>
    <div class="d-sm-none">
      <div class="container-fluid">
        <asset-capture></asset-capture>
      </div>
    </div>
    <div class="d-sm-block d-none">
      <div class="container-fluid d-flex flex-column c-home">
        <controls></controls>
        <div class="row">
          <div class="col-md-9">
            <asset-viewer></asset-viewer>
            <marker-editor></marker-editor>
            <keyframe-editor></keyframe-editor>
            <timeline></timeline>
            <activity></activity>
            <div class="row flex-grow-1">
              <div class="col">
                <b-tabs>
                  <b-tab :active="active">
                    <template v-slot:title>
                      <b-icon-fullscreen style="width: 16px; height: 16px; margin: 0 4px 2px 0;"></b-icon-fullscreen> Keyframes  
                    </template>
                    <arrangement class="pt-3"></arrangement>
                  </b-tab>
                  <b-tab :active="!active">
                    <template v-slot:title>
                      <b-icon-caret-up-fill style="width: 16px; height: 16px; margin: 0 4px 2px 0;"></b-icon-caret-up-fill>  Marker
                    </template>
                    <marker-list class="pt-3"></marker-list>
                  </b-tab>
                </b-tabs>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <video-player></video-player>
            <asset-list></asset-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import VideoPlayer from "@/components/VideoPlayer";
import Activity from "@/components/Activity";
import Timeline from "@/components/Timeline";
import Arrangement from "@/components/Arrangement";
import Controls from "@/components/Controls";
import AssetEditor from "@/components/AssetEditor";
import AssetList from "@/components/AssetList";
import AssetCapture from "@/components/AssetCapture";
import AssetViewer from "@/components/AssetViewer";
import MarkerList from "@/components/MarkerList";
import MarkerEditor from "@/components/MarkerEditor";
import KeyframeEditor from "@/components/KeyframeEditor";

import { mapState } from 'vuex'

export default {
  name: "HomeView",
  components: {
    Controls,
    Activity,
    VideoPlayer,
    MarkerEditor,
    MarkerList,
    AssetList,
    AssetCapture,
    AssetViewer,
    AssetEditor,
    Timeline,
    Arrangement,
    KeyframeEditor
  },
  data: function() {
    return {
    };
  },
  computed: {
    ...mapState('project', ['session']),
    ...mapState('arrangement', ['active']),
  },
  methods: {
  }
};
</script>

<style lang="scss">
.c-home {
  height: calc(100vh - 100px);
  overflow: scroll;
}

.nav-tabs {
  a.nav-link {
      color: var(--secondary);

    &.active {
      color: var(--primary);
    }
  }
}

</style>

