<template>
  <header>
    <div slot="top-right">
      <button
        style="float: right"
        class="closeButton"
        @click="$modal.hide(modalName)"
      >
        x
      </button>
    </div>
    <div>
      {{ title }}
    </div>
  </header>
</template>

<script>
export default {
  name: 'TitleLine',
  props: {
    title: {
      type: String,
      required: true,
    },
    modalName: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
@import '../variables';

header {
  height: $modal-header-height;
  overflow: hidden;
  padding: 3px 5px 3px 20px;
  background-color: #6ea644;
  background-image: linear-gradient(13deg, #80af40 0%, #6ea644 58%);

  font-weight: bold;
  color: white;
}
.closeButton {
  background-color: transparent;
  border: 0;
  font-weight: 500;
  color: white;
  font-size: 20px;
  cursor: pointer;
}
</style>
