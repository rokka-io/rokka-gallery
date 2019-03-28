<template>
  <Category
    v-if="category"
    :category="category"
    :all-tags="allTags"
    :all-albums="allAlbums"
    :global-options="globalOptions"
    :sort="sort"
    :reload="reload"
  />
</template>

<script>
import Category from '@/components/Category';

export default {
  components: {
    Category,
  },
  props: {
    category: {
      type: String,
      default: null,
    },
    allAlbums: {
      type: Array,
      default: () => [],
    },
    allTags: {
      type: Array,
      default: () => [],
    },
    globalOptions: {
      type: Object,
      default: () => {},
    },
    sort: {
      type: String,
      default: 'created desc',
    },
    reload: {
      type: [String, Object, Date],
      default: null,
    },
  },
};
</script>
