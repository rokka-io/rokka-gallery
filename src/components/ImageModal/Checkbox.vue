<template>
  <div>
    <input
      :id="metadataName"
      type="checkbox"
      :disabled="!globalOptions.canWrite"
      :checked="
        image.user_metadata && image.user_metadata[metadataName] === '1'
      "
      @change="metadataUpdate"
    />{{ ' ' }}
    <label :for="metadataName">{{ label }}</label>
  </div>
</template>

<script>
import { map } from 'lodash-es';
import { EventBus } from '../../eventBus';

export default {
  name: 'Checkbox',
  props: {
    label: {
      type: String,
      required: true,
    },

    image: {
      type: Object,
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
    globalOptions: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return { tag: '' };
  },

  methods: {
    metadataUpdate(event) {
      const metadataName = this.metadataName;

      this.$emit('close-message', 'Saving changes ...');
      if (!event.target.checked) {
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
            EventBus.$emit('image-updated', this.hash);
          })
          .catch((err) => {
            console.log(err);
            this.$emit('close-message', 'Error saving changes.');
          })
          .finally(() => {
            this.$emit('image-do-reload');
          });

        return;
      }

      const user_metadata = {};

      user_metadata[metadataName] = 1;

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
              ' updated with value ' +
              1 +
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
        })
        .finally(() => {
          this.$emit('image-do-reload');
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
