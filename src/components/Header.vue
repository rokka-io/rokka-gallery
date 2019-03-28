<template>
  <header class="site-header section section--negative pdgv pdgh+">
    <router-link to="/" class="title">
      <Icon id="rokkalogo" class="title__logo icon " /> Gallery
    </router-link>
    <Search
      :all-tags="allTags"
      :images-count="imagesCount"
      :rokka-org="rokkaOrg"
      :sort="sort"
    />
    <Buttons
      :rokka-org="rokkaOrg"
      :rokka-key="rokkaKey"
      :global-options="globalOptions"
      :sort="sort"
      :all-tags="allTags"
      :all-albums="allAlbums"
      @show-settings-modal="$emit('show-settings-modal')"
    />
  </header>
</template>

<script>
import Search from './Header/Search';
import Buttons from './Header/Buttons';

export default {
  components: {
    Buttons,
    Search,
  },
  props: {
    imagesCount: {
      type: Number,
      default: 0,
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
    rokkaOrg: {
      type: String,
      required: true,
    },
    rokkaKey: {
      type: String,
      required: true,
    },
  },
};
</script>
<style lang="scss"></style>

<style lang="scss" scoped>
.site-header {
  display: grid;
  grid-template-columns: minmax(230px, 250px) minmax(auto, 800px) auto;
  grid-gap: $spacing-unit-small;
  justify-content: space-between;
  align-items: center;

  position: sticky;
  top: 0;
  z-index: 1;

  background-color: #6ea644;
  background-image: linear-gradient(13deg, #80af40 0%, #6ea644 58%);
}

.title {
  color: white;
  font-size: rem(26px);
  line-height: 1;

  &:hover,
  &:focus {
    text-decoration: none;
  }
}

.title__logo {
  width: 130px;
  height: 36px;
  padding-bottom: 2px;
  margin-right: 3px;
}
</style>
