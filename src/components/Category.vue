<template>
  <div class="category">
    <h2 class="mrgt0">
      {{ category }}
      ({{ ofTotal }})
    </h2>
    <ImagesList
      :images="searchResults"
      :all-tags="allTags"
      :all-albums="allAlbums"
      :global-options="globalOptions"
      :searching="searching"
      :cursor-next="searchCursorNext"
      @load-more="search(searchCursorNext)"
    />
  </div>
</template>

<script>
import ImagesList from './ImagesList';

export default {
  name: 'Category',

  components: {
    ImagesList,
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
  },
  data() {
    return {
      searchResults: [],
      searchCursorNext: null,
      searching: false,
    };
  },

  computed: {
    ofTotal() {
      let text = '';
      if (this.searchResults && !this.searching) {
        text =
          this.searchResults.length
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, "'") + ' images';
        if (this.searchResults.length < this.searchResultsTotal) {
          text += ` of total ${this.searchResultsTotal
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;
        }
      } else {
        text = 'loading..';
      }

      return text;
    },
  },
  watch: {
    category() {
      this.searchResults = [];
      this.search();
    },
    sort() {
      this.search();
    },
    reload() {
      this.search();
    },
  },
  created() {
    this.search();
  },
  methods: {
    search(cursor = null) {
      let search = { limit: 100 };
      this.searching = true;
      if (this.category.length > 0) {
        search = {
          'user:array:albums': this.category,
          limit: 200,
        };
      }
      this.$rokka(this.globalOptions.rokkaKey)
        .sourceimages.list(this.globalOptions.rokkaOrg, {
          search: search,
          sort: this.sort,

          offset: cursor,
        })
        .then((result) => {
          if (cursor === null) {
            this.searchResults = result.body.items;
          } else {
            this.searchResults = this.searchResults.concat(result.body.items);
          }
          this.searchResultsTotal = result.body.total;
          if (this.searchResultsTotal > this.searchResults.length) {
            this.searchCursorNext = result.body.cursor;
          } else {
            this.searchCursorNext = null;
          }
          this.searching = false;
        });
    },
  },
};
</script>
