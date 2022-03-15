<template>
  <svg :class="`icon icon--${id}`">
    <use :xlink:href="url" />
  </svg>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
  computed: {
    url() {
      return `${this.publicPath}assets/icons.svg#${this.id}`;
    },
  },
};
</script>
