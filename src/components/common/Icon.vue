<template>
  <svg :class="`icon icon--${id}`">
    <title v-if="title">{{ title }}</title>
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
    title: {
      type: String,
      required: false,
      default: null,
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
