<template>
  <button
    v-if="globalOptions.deleteEnabled && globalOptions.canWrite"
    :class="['button', reallyDelete ? 'warning' : 'prewarning']"
    @click="deleteImage"
  >
    {{ deleteMessage }}
  </button>
</template>

<script>
export default {
  name: 'DeleteButton',
  props: {
    globalOptions: {
      type: Object,
      required: true,
    },
    image: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deleteMessage: 'Delete image',
      reallyDelete: false,
    };
  },
  watch: {
    image() {
      if (this.image.deleted) {
        this.deleteMessage = 'Restore Image!';
      } else {
        this.reallyDelete = false;
        this.deleteMessage = 'Delete image';
      }
    },
  },
  methods: {
    deleteImage() {
      if (this.reallyDelete) {
        this.$rokka(this.globalOptions.rokkaKey)
          .sourceimages.delete(this.globalOptions.rokkaOrg, this.image.hash)
          .then(() => {
            this.$emit('image-do-reload');
            this.deleteMessage = 'Restore Image!';
            this.reallyDelete = false;
            this.$toast.warning('Image deleted! But you can still restore it.');
          });
        return;
      }

      if (this.image.deleted) {
        this.$rokka(this.globalOptions.rokkaKey)
          .sourceimages.restore(this.globalOptions.rokkaOrg, this.image.hash)
          .then(() => {
            this.$emit('image-do-reload');
            this.reallyDelete = false;
            this.deleteMessage = 'Delete Image';
            this.$toast.info('Image restored!');
          });
        return;
      }

      this.reallyDelete = true;
      this.deleteMessage = 'Really delete this image?';
    },
  },
};
</script>

<style scoped lang="scss"></style>
