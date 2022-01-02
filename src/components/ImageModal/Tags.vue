<template>
  <div>
    <vue-tags-input
      v-model="tag"
      :disabled="!globalOptions.canWrite"
      :placeholder="globalOptions.canWrite ? 'Add ' + label : label"
      :tags="tags"
      :allow-edit-tags="true"
      :autocomplete-items="filteredTags"
      :autocomplete-min-length="autocompleteMinLength"
      @tags-changed="tagsUpdate"
    >
      <div v-if="!globalOptions.canWrite" slot="tag-actions"></div>
    </vue-tags-input>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';
import { map } from 'lodash-es';
import { EventBus } from '../../eventBus';

export default {
  name: 'Tags',
  components: {
    VueTagsInput,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    metadataName: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    allTags: {
      type: Array,
      default: () => [],
    },
    globalOptions: {
      type: Object,
      default: () => {},
    },
    tagsBeforeUpdate: {
      type: Function,
      default: null,
    },
    autocompleteMinLength: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return { tag: '' };
  },
  computed: {
    filteredTags() {
      return this.allTags.filter((i) => {
        return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) === 0;
      });
    },
  },
  methods: {
    tagsUpdate(newTags) {
      if (this.tagsBeforeUpdate instanceof Function) {
        newTags = this.tagsBeforeUpdate(newTags);
      }
      this.metdataUpdate(newTags);
    },
    metdataUpdate(newTags) {
      const metadataName = this.metadataName;

      const tags = map(newTags, (a) => {
        return a.text;
      });
      const user_metadata = {};
      user_metadata[metadataName] = tags;

      this.$emit('close-message', 'Saving changes ...');
      if (newTags.length === 0) {
        this.$rokka(this.globalOptions.rokkaKey)
          .sourceimages.meta.delete(
            this.globalOptions.rokkaOrg,
            this.hash,
            metadataName
          )
          .then((result) => {
            this.$emit('close-message', 'Close (changes are already saved)');

            console.log(
              'Image metadata for ' +
                metadataName +
                ' deleted ' +
                ' and statusCode ' +
                result.statusCode
            );
          })
          .catch((err) => {
            console.log(err);
            this.$emit('close-message', 'Error saving changes.');
          });
        return;
      }
      this.$rokka(this.globalOptions.rokkaKey)
        .sourceimages.meta.add(
          this.globalOptions.rokkaOrg,
          this.hash,
          user_metadata
        )
        .then((result) => {
          this.$emit('close-message', 'Close (changes are already saved)');

          console.log(
            'Image metadata for ' +
              metadataName +
              ' updated with tags ' +
              tags +
              ' and statusCode ' +
              result.statusCode
          );
          EventBus.$emit('image-updated', this.hash);
        })
        .catch((err) => {
          console.log(err);
          let errorText = 'Error saving changes.';
          if (err.statusCode === 403) {
            EventBus.$emit('read-only-key', true);
            errorText +=
              " You're not allowed to do that, please use a different API key.";
          }
          this.$toast.error(errorText);
          this.$emit('close-message', 'Close');
        });
    },
  },
};
</script>

<style scoped lang="scss">
.vue-tags-input {
  padding: 3px 0;
}
</style>
