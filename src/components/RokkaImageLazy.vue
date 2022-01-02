<template>
  <rokka-img-lazy
    :key="image.short_hash"
    :organization="image.organization"
    :hash="image.hash"
    :filename="`${image.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[.?]/g, '_')}_v5781632.${image.format}`"
    :stack="stack"
    :format="format"
    :alt="alt"
    :loading="loading"
    :options="[{ af: 1 }, { af: 1, dpr: 2 }]"
  />
</template>

<script>
import { RokkaImgLazy } from 'vue-rokka-image-lazy';

export default {
  name: 'RokkaImageLazy',
  components: {
    RokkaImgLazy,
  },
  props: {
    image: {
      type: Object,
      required: true,
    },
    stack: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    loading: {
      type: String,
      default: null,
    },
  },
  computed: {
    alt() {
      if (
        this.image.static_metadata &&
        this.image.static_metadata.exif &&
        this.image.static_metadata.exif.title
      ) {
        return this.image.static_metadata.exif.title;
      }
      return this.image.name;
    },
  },
};
</script>

<style scoped></style>
