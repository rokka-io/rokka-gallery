<template>
  <div class="category">
    <h2 class="mrgt0">
      {{ category }}
      ({{ ofTotal }})
      <button
        v-if="searchResults.length > 0"
        class="button"
        style="border: 0; background-color: #ffffff00"
        title="Download max 100 images as Zip"
        @click="download"
      >
        <Icon v-if="!downloading" id="download-circle" class="icon--150" />
        <img
          v-if="downloading"
          class="icon icon--150"
          :src="`${baseUrl}assets/loader.svg`"
        />
      </button>
    </h2>
    <ImagesList
      :images="searchResults"
      :all-tags="allTags"
      :all-albums="allAlbums"
      :global-options="globalOptions"
      :searching="searching"
      :cursor-next="searchCursorNext"
      @load-more="search(searchCursorNext)"
      @update-image="(index, image) => updateImage(index, image)"
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
      downloading: false,
      baseUrl: process.env.BASE_URL,
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
    async download() {
      let search = { limit: 100 };
      this.downloading = true;
      if (this.category.length > 0) {
        search = {
          'user:array:albums': '"' + this.category + '"',
          limit: 100,
        };
      }
      this.$rokka(this.globalOptions.rokkaKey)
        .sourceimages.downloadList(this.globalOptions.rokkaOrg, {
          search: search,
          sort: this.sort,
        })
        .then(async (result) => {
          this.downloading = false;

          const imageBlog = await result.response.blob();
          const imageURL = URL.createObjectURL(imageBlog);

          const anchor = document.createElement('a');
          anchor.href = imageURL;
          anchor.download =
            this.globalOptions.rokkaOrg +
            '_' +
            this.category.replace('/', '_') +
            '.zip';

          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);

          URL.revokeObjectURL(imageURL);
        })
        .catch(() => {
          this.$toast.error(
            'Something went wrong creating the Zip. Maybe too many or too big pictures?'
          );
        });
    },
    search(cursor = null) {
      let search = { limit: 100 };
      this.searching = true;
      if (this.category.length > 0) {
        search = {
          'user:array:albums': '"' + this.category + '"',
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
    updateImage(index, image) {
      this.searchResults[index] = image;
    },
  },
};
</script>
<style scoped lang="scss">
.button {
  position: relative;
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 500;
  padding: $spacing-unit-tiny $spacing-unit-small;
  border: 0;
  &:hover {
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  }
  cursor: pointer;
}
</style>
