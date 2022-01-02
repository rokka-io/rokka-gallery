<template>
  <div>
    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
      <div class="field-label">Hash:</div>
      <button v-clipboard:copy="image.hash">
        <Icon id="copy" class="icon--75" /></button
      ><span
        style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
      >
        {{ image.hash }}
      </span>
    </div>
    <div>
      <div class="field-label">Short Hash:</div>
      <button v-clipboard:copy="image.short_hash">
        <Icon id="copy" class="icon--75" />
      </button>
      {{ image && image.short_hash ? image.short_hash : '' }}
    </div>
    <div>
      <div class="field-label">Created:</div>
      {{ humanReadableCreated }}
    </div>
    <div>
      <div class="field-label">Mime-Type:</div>
      {{ image ? image.mimetype : '' }}
    </div>
    <div>
      <div class="field-label">Size:</div>
      {{ humanReadableSize }}
    </div>
    <div>
      <div class="field-label">Dimensions:</div>
      {{ image.width }} x {{ image.height }}
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);

export default {
  name: 'MainData',
  props: {
    image: {
      type: Object,
      required: true,
    },
  },
  computed: {
    humanReadableSize() {
      const bytes = this.image.size;
      if (bytes === 0) {
        return '0 B';
      }
      const e = Math.floor(Math.log(bytes) / Math.log(1024));
      return (
        (bytes / Math.pow(1024, e)).toFixed(1) + ' ' + ' KMGTP'.charAt(e) + 'B'
      );
    },
    humanReadableCreated() {
      if (!this.image) {
        return '';
      }
      return dayjs(this.image.created).format('ll, HH:mm:ss Z');
    },
  },
};
</script>

<style scoped></style>
