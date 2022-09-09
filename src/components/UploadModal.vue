<template>
  <div id="modal">
    <TitleLine title="Upload Images" modal-name="modal-upload" />

    <div class="upload-container">
      <div class="upload-files">
        <vue-rokka-uploader
          ref="upload"
          :rokka-token="globalOptions.rokkaToken"
          :rokka-org="globalOptions.rokkaOrg"
          :append-promise="appendPromise"
          :image-metadata="imageMetadata"
          @uploading="uploadingEvent"
          @uploaded="uploadedEvent"
        >
          <template v-slot:buttons>
            <span />
          </template>
          <span></span>
        </vue-rokka-uploader>
      </div>
      <div class="upload-actions">
        <div class="upload-helptext">
          Drag images into the gray area above or browse for adding images.
        </div>
        <button
          class="button file-uploads file-uploads-html5 file-uploads-drop"
        >
          Browse...
          <label for="file"></label>
          <input id="file" type="file" name="file" multiple="multiple" />
        </button>

        <button
          type="button"
          class="button cancel"
          @click.prevent="$refs.upload.$refs.upload.clear()"
        >
          Clear files
        </button>
      </div>
      <div class="upload-form-container">
        <div class="upload-form">
          <div class="field-label">Labels:</div>
          <vue-tags-input
            v-model="tag"
            placeholder="Add Labels"
            :tags="tags"
            :allow-edit-tags="true"
            :autocomplete-items="filteredTags"
            @tags-changed="tagsUpdate"
          />
          <div class="field-label">Albums:</div>
          <vue-tags-input
            id="albums"
            v-model="album"
            placeholder="Add Albums"
            :tags="albums"
            :allow-edit-tags="true"
            :autocomplete-items="filteredAlbums"
            :autocomplete-min-length="0"
            @tags-changed="albumsUpdate"
          />
        </div>
        <button
          v-if="uploaded"
          type="button"
          class="button"
          @click.prevent="$refs.upload.$refs.upload.active = false"
        >
          Uploaded
        </button>
        <button
          v-else-if="!uploading"
          type="button"
          class="button"
          @click.prevent="$refs.upload.$refs.upload.active = true"
        >
          Upload
        </button>

        <button
          v-else
          type="button"
          class="button warning"
          @click.prevent="$refs.upload.$refs.upload.active = false"
        >
          Stop Upload
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { map } from 'lodash-es';
import VueTagsInput from '@johmun/vue-tags-input';
import { EventBus } from '../eventBus';
import TitleLine from './Modal/TitleLine';
import VueRokkaUploader from 'vue-rokka-uploader';
export default {
  name: 'ImageModal',
  components: {
    TitleLine,
    VueTagsInput,
    VueRokkaUploader,
  },
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
  },

  data() {
    return {
      tag: '',
      tags: [],
      album: '',
      albums: [],
      uploading: false,
      uploaded: false,
    };
  },
  computed: {
    filteredTags() {
      return this.allTags.filter((i) => {
        return i.text?.toLowerCase().indexOf(this.tag.toLowerCase()) === 0;
      });
    },
    filteredAlbums() {
      return this.allAlbums.filter((i) => {
        return i.text?.toLowerCase().indexOf(this.album.toLowerCase()) === 0;
      });
    },
    albumsText() {
      return map(this.albums, (album) => {
        return album.text;
      });
    },
    tagsText() {
      return map(this.tags, (tag) => {
        return tag.text;
      });
    },
  },
  methods: {
    imageMetadata() {
      const metadata = { meta_user: {} };
      if (this.albumsText.length > 0) {
        metadata.meta_user['array:albums'] = this.albumsText;
      }
      if (this.tagsText.length > 0) {
        metadata.meta_user['array:labels'] = this.tagsText;
      }
      return metadata;
    },
    appendPromise(request) {
      const rokka = this.$rokka();

      return request.then((result) => {
        if (result.body && result.body.items && result.body.items[0]) {
          const image = result.body.items[0];
          if (this.globalOptions.canWrite) {
            console.log(`Image ${image.name} uploaded. Applying autolabels.`);
            rokka.sourceimages
              .autolabel(this.globalOptions.rokkaOrg, result.body.items[0].hash)
              .then(function () {
                console.log(`Image ${image.name} autolabeled.`);
                EventBus.$emit(
                  'image-updated',
                  result.body.items[0].hash,
                  result.body.items[0]
                );
                EventBus.$emit(
                  'image-added',
                  result.body.items[0].hash,
                  result.body.items[0]
                );
              });
          }
        }
      });
    },
    uploadingEvent(e) {
      this.uploading = e;
    },
    uploadedEvent(e) {
      console.log('uploaded', e);
      this.uploaded = e;
    },

    tagsUpdate(newTags) {
      this.tags = newTags;
    },
    albumsUpdate(newTags) {
      this.albums = newTags;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '_modal.scss';

#modal {
  :deep(#upload_image_form--default) {
    background-color: #eee;
    height: calc(100% - #{$modal-header-height});
  }

  :deep(.vue_component__upload--image) {
    height: calc(100%);
  }
  :deep(.vue-tags-input) {
    max-width: 95% !important;
  }
  :deep(.upload_image_form__thumbnails) {
    height: calc(100% - 10px);
  }
  #footer {
    display: none;
  }
  #main {
    height: calc(100% - #{$modal-header-height});
    padding-bottom: 20px;
  }
  :deep(.rokka-uploader) {
    :deep(.drop-active h3) {
      margin: -0.5em 0 0;
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      font-size: 40px;
      color: #fff;
      padding: 0;
    }

    :deep(.removeButton) {
      background-color: transparent;
      border: 0;
      font-weight: 100;
      color: black;
      cursor: pointer;
    }

    :deep(.remove) {
      width: 5px;
      padding: 0;
    }

    :deep(td) {
      padding: 3px 0;
    }
  }
  :deep(.button) {
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
}
</style>
