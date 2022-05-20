<template>
  <div class="options">
    <div v-if="sortClicked" class="sortChooser">
      <li
        v-for="option in sortOptions"
        :key="option.value"
        :class="sort === option.value ? 'selected' : null"
        @click="sortUpdate(option.value)"
      >
        {{ option.text }}
      </li>
    </div>

    <button class="button" title="Sort" @click="sortClick">
      <Icon id="sort" class="icon--100" />
    </button>

    <button class="button" title="Gallery view" @click="showGallery()">
      <Icon id="fullscreen" class="icon--100" />
    </button>

    <button
      v-if="globalOptions.canUpload"
      class="button"
      title="Upload images"
      @click="showUploadModal()"
    >
      <Icon id="upload" class="icon--100" />
    </button>
    <button
      class="button"
      title="Credentials"
      @click="$emit('show-settings-modal')"
    >
      <Icon id="settings" class="icon--100" />
    </button>

    <button class="button" title="Logout" @click="logout()">
      <Icon id="logout" class="icon--100" />
    </button>
  </div>
</template>

<script>
import UploadModal from '../UploadModal';
import SettingsModal from '../SettingsModal';
import { EventBus } from '../../eventBus';

export default {
  name: 'Buttons',
  props: {
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
    const sortOptions = [
      { text: 'Uploaded desc', value: 'created desc' },
      { text: 'Uploaded asc', value: 'created asc' },
      { text: 'Taken desc', value: 'static:date:exif:taken desc' },
      { text: 'Taken asc', value: 'static:date:exif:taken asc' },
      { text: 'Taken or Uploaded desc', value: 'taken_or_created desc' },
      { text: 'Taken or Uploaded asc', value: 'taken_or_created asc' },
    ];

    return {
      sortClicked: false,
      sortOptions,
    };
  },
  methods: {
    sortClick(e) {
      e.target.blur();
      this.sortClicked = !this.sortClicked;
    },
    sortUpdate(sort) {
      const query = {};
      if (sort !== 'created desc') {
        query.sort = sort;
      }
      this.$router.push({
        path: this.$route.path,
        query,
      });
      this.sortClicked = false;
    },
    logout() {
      EventBus.$emit('credentials-updated', '', '');
    },
    showGallery() {
      EventBus.$emit('show-gallery', null);
    },
    showUploadModal() {
      this.$modal.show(
        UploadModal,
        {
          allAlbums: this.allAlbums,
          allTags: this.allTags,
          globalOptions: this.globalOptions,
        },
        {
          height: '700px',
          width: '600px',
          maxWidth: 1000,
          maxHeight: 1000,
          name: 'modal-upload',
        }
      );
    },
    showSettingsModal() {
      this.$modal.show(
        SettingsModal,
        {
          rokkaKey: this.globalOptions.rokkaKey,
          rokkaOrg: this.globalOptions.rokkaOrg,
        },
        {
          height: '300px',
          width: '90%',
          maxWidth: 1000,
          maxHeight: 300,
          name: 'modal-settings',
        }
      );
    },
  },
};
</script>

<style scoped lang="scss">
.options {
  display: flex;
  align-items: center;
}

.button {
  position: relative;
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 500;
  padding: $spacing-unit-tiny $spacing-unit-small;
  border: 0;
  margin-right: 10px;
  height: 60px;
  width: 70px;
  &:hover {
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  }
  cursor: pointer;
  svg {
    width: 28px;
    height: 28px;
  }
}

.upload_image_form__thumbnails {
  height: 50px;
}
.vue_component__upload--image {
  width: 300px;
}
.sortChooser {
  position: fixed;
  top: 60px + $spacing-unit-small * 2;
  background-color: white;
  color: black;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  border: 1px $green-700 solid;
  li:first-child {
    margin-top: 0;
  }
  li {
    padding: 0 1em 0 1em;
    margin-top: 1px;
    display: block;
    &:hover {
      cursor: pointer;
      color: white;
      background-color: $green-700;
    }
    &.selected {
      background-color: $green-700;
      color: white;
    }
  }
}
</style>
