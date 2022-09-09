<template>
  <div class="search">
    <button class="search-btn btn" @click="search">
      <Icon id="search" class="icon icon--100" />
    </button>

    <vue-tags-input
      v-model="tag"
      class="search-field field field--large"
      :autocomplete-items="filteredTags"
      :add-on-blur="false"
      :placeholder="`Search ${imagesCount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '\'')} images in ${rokkaOrg}…`"
      @before-adding-tag="beforeAddingTag"
    />
    <button
      v-if="tag.length"
      class="discard-btn btn btn--bare"
      @click="clickDiscard"
    >
      <Icon id="remove" class="icon icon--100" />
    </button>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';
import { EventBus } from '../../eventBus';

export default {
  components: {
    VueTagsInput,
  },
  props: {
    allTags: {
      type: Array,
      default: () => [],
    },
    imagesCount: {
      type: Number,
      default: 0,
    },
    rokkaOrg: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tagIntern: null,
      tagJustAdded: false,
    };
  },
  computed: {
    tag: {
      get() {
        if (this.tagIntern !== null) {
          return this.tagIntern;
        }
        let tag = '';
        if (this.$route.params && this.$route.params.search) {
          tag = this.$route.params.search;
        }
        return tag;
      },
      set(v) {
        if (this.tagIntern !== v) {
          this.tagIntern = v;
          this.tagJustAdded = false;
        }
      },
    },
    filteredTags() {
      if (this.tagJustAdded === true) {
        return [];
      }
      const tag = this.tag;
      if (tag === ' ') {
        return this.allTags;
      }
      let search = tag.toLowerCase();
      if (search.substr(0, 1) === ' ') {
        search = search.substr(1);
      }
      const filtered = this.allTags.filter((i) => {
        return i.text.toLowerCase().indexOf(search) === 0;
      });
      if (filtered.length === 1 && filtered[0].text === search) {
        return [];
      }
      return filtered.map((f) => {
        return {
          ...f,
          text: f.text.includes(' ') ? '"' + f.text + '"' : f.text,
        };
      });
    },
  },
  methods: {
    clickDiscard() {
      this.tag = '';
      if (this.$route.path !== '/') {
        this.search();
      }
    },
    beforeAddingTag(e) {
      this.tag = e.tag.text;
      this.tagJustAdded = true;
      this.search();
    },
    search() {
      const newSearch = this.tag.trim();
      const query = {};
      if (this.$route.path === '/_/' + newSearch) {
        EventBus.$emit('search-reload');
        return;
      }
      if (this.$route.query.sort) {
        query.sort = this.$route.query.sort;
      }
      if (newSearch.length > 0) {
        this.$router
          .push({
            path: '/_/' + encodeURIComponent(newSearch),
            query,
          })
          .catch((err) => {
            if (err.name === 'NavigationDuplicated') {
              EventBus.$emit('search-reload');
            }
          });
      } else {
        this.$router.push({ path: '/', query }).catch((err) => {
          if (err.name === 'NavigationDuplicated') {
            EventBus.$emit('search-reload');
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  position: relative;

  :deep(.ti-item) {
    color: black;
    font-size: 1.2rem;
  }

  :deep(.ti-input),
  :deep(.ti-new-tag-input) {
    border-color: transparent !important;
    background-color: transparent !important;
    color: white !important;

    &:hover,
    &:focus {
      color: white;
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  :deep(.vue-tags-input) {
    max-width: none !important;

    .ti-selected-item {
      background-color: $green-700 !important;
      color: white;
    }
    .ti-autocomplete {
      overflow: auto;
      max-height: calc(100vh - 80px);
    }
  }
}

.search-field {
  padding-left: $spacing-unit-default * 3;
  padding-right: $spacing-unit-default * 3;

  color: white;

  border-color: transparent !important;
  background-color: rgba(255, 255, 255, 0.15) !important;

  &:hover,
  &:focus {
    color: white;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
}

.search-btn {
  position: absolute;
  color: rgba(255, 255, 255, 0.5);
  top: 50%;
  left: 10px;
  //left: $spacing-unit-default;
  transform: translateY(-50%);

  padding: 10px;
  &:hover,
  &:focus {
    color: white;
  }
  z-index: 10;
}

.discard-btn {
  position: absolute;
  top: 50%;
  right: $spacing-unit-default;

  color: rgba(255, 255, 255, 0.5);

  transform: translateY(-50%);

  &:hover,
  &:focus {
    color: white;
  }
}
</style>
