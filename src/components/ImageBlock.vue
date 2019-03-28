<template>
  <div :key="image.short_hash" :class="['image-block']" @click="imageDivClick">
    <rokka-image-lazy
      v-if="image.short_hash"
      :image="image"
      :stack="stack"
      :format="format"
      :style="{ maxWidth: '200px', maxHeight: '200px' }"
    />

    <span class="image-block__name">{{ imageTitle }}</span>
  </div>
</template>

<script>
import rokkaHelper from '../rokkaHelper';
import rokkaImageLazy from './RokkaImageLazy';

export default {
  components: {
    rokkaImageLazy,
  },
  props: {
    image: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    rokkaOrg: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      error: false,
      baseUrl: process.env.BASE_URL,
    };
  },

  computed: {
    stack() {
      return rokkaHelper.getStackByDimensions(200);
    },
    format() {
      return rokkaHelper.getOriginalCompatibleFormat(this.image);
    },

    imageTitle() {
      return rokkaHelper.imageTitle(this.image);
    },
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

  methods: {
    imageDivClick() {
      this.$emit('show-modal-image-index', this.index);
    },
  },
};
</script>

<style lang="scss" scoped>
.image-block {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-rows: 1fr auto;
  padding: $spacing-unit-default;

  cursor: pointer;
  text-align: center;

  width: 100%;
  background-color: white;
  transition: all 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);

  &:hover,
  &:focus,
  &:focus-within {
    perspective: 0;
    backface-visibility: hidden;
    will-change: transform;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.15);
  }
  /deep/ img {
    margin-left: auto;
    margin-right: auto;
  }
}

.image-block__name {
  align-self: flex-end;

  font-size: rem(12px);
  word-break: break-word;
}
</style>
