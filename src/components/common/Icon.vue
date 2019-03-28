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

  computed: {
    url() {
      return `${process.env.BASE_URL}assets/icons.svg#${this.id}`;
    },
  },
};
</script>
