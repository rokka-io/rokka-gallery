<template>
  <nav class="pdg-">
    <ul class="list-stacked list-stacked--tiny">
      <li v-for="(category, i) in categories" :key="i">
        <NavItem :category="category" />
      </li>
    </ul>
  </nav>
</template>

<script>
import NavItem from './NavItem';

export default {
  name: 'Nav',

  components: {
    NavItem,
  },

  props: {
    categories: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
