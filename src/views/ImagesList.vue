<template>
  <Loader v-if="searching && searchCursorNext === null" />
  <div v-else-if="searchResults.length > 0">
    <h2 class="mrgt0">
      {{ searchResults.length }} images
      {{ query !== '' ? 'for ' + query : '' }}

      {{
                searchResults.length &lt; searchResultsTotal
                ? `(of total ${searchResultsTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")})`
                : ''
      }}
    </h2>
    <ImagesList
      :images="searchResults"
      :all-albums="allAlbums"
      :all-tags="allTags"
      :global-options="globalOptions"
      :searching="searching"
      :cursor-next="searchCursorNext"
      @load-more="search(searchCursorNext)"
    />
  </div>
  <div v-else class="text-lead text-muted text-center">
    No images found matching “{{ query }}”.
  </div>
</template>

<script>
import ImagesList from '@/components/ImagesList';
import Loader from '@/components/common/Loader';
import { forEach } from 'lodash-es';

export default {
  components: {
    ImagesList,
    Loader,
  },
  props: {
    query: {
      type: String,
      required: true,
      default: '',
    },
    allAlbums: {
      type: Array,
      default: () => [],
    },
    allTags: {
      type: Array,
      default: () => [],
    },
    sort: {
      type: String,
      default: 'created desc',
    },
    globalOptions: {
      type: Object,
      default: () => {},
    },
    reload: {
      type: [String, Object, Date, Number],
      default: null,
    },
  },
  data() {
    return {
      searching: false,
      searchResults: [],
      searchResultsTotal: 0,
      searchCursorNext: null,
    };
  },
  watch: {
    query() {
      this.search();
    },
    reload() {
      this.searchResults = [];
      this.searchResultsTotal = 0;
      this.searchCursorNext = null;
      this.search();
    },
    sort() {
      this.search();
    },
  },
  created() {
    this.search();
  },
  methods: {
    search(cursor = null) {
      const rokka = this.$rokka(this.globalOptions.rokkaKey);
      if (rokka === null) {
        this.searchResults = [];
        this.searchResultsTotal = 0;
        return;
      }

      let search = { limit: 100 };
      this.searching = true;

      const searchFields = [
        'name_text',
        'user:array:albums',
        'user:text:description',
        'user:text:title',
        'static:text:exif:description',
        'static:text:exif:title',
      ];
      const searchFieldsLowerCased = [
        'user:array:labels',
        'static:array:exif:keywords_lower',
        'static:str:location:country',
        'static:str:location:state',
        'static:str:location:city',
        'static:array:autolabels:labels',
      ];
      if (this.query.length > 0) {
        if (this.query.includes('=')) {
          const searchParams = this.query.split('=');
          search[searchParams[0]] = searchParams[1];
        } else {
          search = {
            operator: 'or',
            limit: 500,
          };
          forEach(searchFields, (key) => {
            search[key] = this.query;
          });
          forEach(searchFieldsLowerCased, (key) => {
            search[key] = this.query.toLowerCase();
          });
        }
      }
      rokka.sourceimages
        .list(this.globalOptions.rokkaOrg, {
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
