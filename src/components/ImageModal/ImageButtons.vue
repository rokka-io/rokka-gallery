<template>
  <span v-if="globalOptions.downloads">
    <button
      v-if="!(globalOptions.downloads && globalOptions.downloads.original)"
      class="button"
      @click="openImage(null)"
    >
      Open original
    </button>
    <button
      v-for="(button, i) in globalDownloadOptions"
      :key="i"
      class="button"
      @click="openImage(button.url)"
    >
      {{ resolveButtonTitle(button.title) }}
    </button>
  </span>
  <span v-else>
    <button class="button button-openimg" @click="openImage(null)">
      Open original
    </button>
  </span>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'ImageButtons',
  props: {
    globalOptions: {
      type: Object,
      required: true,
    },
    image: {
      type: Object,
      required: true,
    },
  },
  computed: {
    globalDownloadOptions() {
      return _.pickBy(this.globalOptions.downloads, el => {
        return this.resolveButtonTitle(el.title) !== null;
      });
    },
  },
  methods: {
    resolveButtonTitle(title) {
      if (title instanceof Function) {
        return title(this.image);
      }
      return title;
    },
    openImage(src = null) {
      if (src !== null) {
        if (src instanceof Function) {
          window.open(src(this.image, this.globalOptions.rokkaOrg));
        } else {
          window.open(src);
        }
        return;
      }
      let format = null;
      if (this.image.mimetype === 'video/mp4') {
        format = 'mp4';
      }
      window.open(
        this.$rokkaRenderUrl(
          this.image,
          this.globalOptions.rokkaOrg,
          null,
          null,
          format,
          'dynamic'
        )
      );
    },
  },
};
</script>

<style scoped></style>
