<template>
  <div>
    <div class="media media--tight">
      <div class="media__left">
        <button @click="toggleOpen()" type="button" class="btn btn--bare btn--small toggle-btn" style="padding: 5px 0px 5px 0;width: 14px">
          <svg  v-if="category.children.length > 0" :class="`icon--50 icon icon--caret-${this.open ? 'down' : 'right'}`">
          <use :href="`/assets/icons.svg#caret-${this.open ? 'down' : 'right'}`"></use>
        </svg></button>

      </div>
      <div class="media__body" >
        <div @click="routerClick()">
          <router-link
              :to="
            `/${category.slug}` +
            (this.$route.query && this.$route.query.sort
              ? '?sort=' + encodeURIComponent(this.$route.query.sort)
              : '')
          "
              class="link"
              style="padding-left: 3px"
          >{{ category.name }}
          </router-link
          >
        </div>
        <div v-if="this.open ">
          <nav-item v-for="(child,i) in category.children" :key="i"
                    :category="{...child, slug: `${category.slug }/${child.name}`}"/>
        </div>

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
  methods: {
    routerClick() {
      this.setOpen(true);
    },
    toggleOpen() {
    this.open = !this.open

    },
    setOpen(toggle){
      this.open = toggle
    }
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
