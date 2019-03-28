<template>
  <div>
    <div class="media media--tight">
      <div class="media__body">
        <router-link
          :to="
            `/${category.slug}` +
              (this.$route.query && this.$route.query.sort
                ? '?sort=' + encodeURIComponent(this.$route.query.sort)
                : '')
          "
          class="link"
          @click="$emit('input', '')"
          >{{ category.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavItem',

  props: {
    category: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      open: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.link {
  display: block;
  padding: 1px 8px;

  color: $warm-grey-800;
  font-weight: 500;

  border-radius: 3px;

  &:hover,
  &:focus {
    text-decoration: none;

    background-color: $warm-grey-50;
  }

  &.router-link-active {
    color: $green-700;
    font-weight: bold;

    background-color: transparentize($green-400, 0.9);
  }
}

.toggle-btn {
  padding: 7px 10px;
}
</style>
