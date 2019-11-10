<template>
  <modal
    name="modal-image"
    height="48%"
    width="80%"
    :max-width="1500"
    :max-height="1000"
    :adaptive="true"
    @before-open="beforeOpen"
    @before-close="beforeClose"
  >
    <div v-if="image" id="modal">
      <TitleLine
        modal-name="modal-image"
        :title="image && image.name ? imageTitle : ''"
      />
      <div id="main">
        <div class="left">
          <div class="left-content" @click="imgClicked">
            <rokka-image-lazy
              :loading="`${baseUrl}assets/loader.svg`"
              :image="image"
              :stack="stack"
              :format="format"
            />
          </div>

          <ImageButtons :global-options="globalOptions" :image="localImage" />
          <div class="footer">
          </div>
        </div>

        <div class="data">
          <div class="data-content">
            <CollapsibleSection
              title="Main"
              key-name="main"
              :data="true"
              :default-state="true"
            >
              <MainData :image="localImage" />
            </CollapsibleSection>

            <CollapsibleSection
              title="Labels & Albums"
              key-name="labels"
              :data="true"
              :default-state="true"
            >
              <Tags
                label="Labels"
                :tags="labels"
                :all-tags="allTags"
                :tags-before-update="beforeLabelsUpdate"
                metadata-name="array:labels"
                :hash="image.hash"
                :global-options="globalOptions"
                @close-message="closeMessageUpdate"
              />
              <Tags
                label="Albums"
                :tags="albums"
                :all-tags="allAlbums"
                metadata-name="array:albums"
                :hash="image.hash"
                :global-options="globalOptions"
                :autocomplete-min-length="0"
                @close-message="closeMessageUpdate"
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="Location"
              key-name="location"
              :data="locationdata"
            />

            <CollapsibleSection title="Exif" key-name="exif" :data="exifdata" />

            <CollapsibleSection
              title="Other user metadata"
              key-name="other"
              :data="otherMetadata"
            />
            <CollapsibleSection
              title="Video"
              key-name="video"
              :data="videodata"
            />

            <CollapsibleSection
              title="Dynamic metadata"
              key-name="dynamic"
              :data="dynamicMetadata"
            />
            <CollapsibleSection
              title="Autolabels"
              key-name="autolables"
              :data="autolabels.length > 0"
            >
              <div v-if="autolabels.length > 0">
                <span v-for="(label, index2) in autolabels" :key="label"
                  >{{ label
                  }}<span v-if="index2 != autolabels.length - 1">, </span>
                </span>
              </div>
            </CollapsibleSection>
            <CollapsibleSection
              title="Other static metadata"
              key-name="otherstatic"
              :data="otherStatic"
            />
            <CollapsibleSection
              v-if="globalOptions.deleteEnabled && globalOptions.canWrite"
              title="Delete image"
              key-name="operations"
              :data="true"
            >
              <div style="margin-top: 10px; margin-left: 10px">
                <DeleteButton
                  :global-options="globalOptions"
                  :image="localImage"
                  @image-do-reload="loadImageDataFromRokka"
                />
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import { map, forEach } from 'lodash-es';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import rokkaHelper from '../rokkaHelper';
import CollapsibleSection from './ImageModal/CollapsibleSection';
import TitleLine from './Modal/TitleLine';
import Tags from './ImageModal/Tags';
import ImageButtons from './ImageModal/ImageButtons';
import DeleteButton from './ImageModal/DeleteButton';
import MainData from './ImageModal/MainData';
import rokkaImageLazy from './RokkaImageLazy';

dayjs.extend(LocalizedFormat);

const capital_letter = str => {
  str = str.split(' ');

  for (var i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }

  return str.join(' ');
};

export default {
  name: 'ImageModal',
  components: {
    MainData,
    DeleteButton,
    ImageButtons,
    Tags,
    TitleLine,
    CollapsibleSection,
    rokkaImageLazy,
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
    handleKeyEvents: {
      type: Boolean,
      default: true,
    },
    image: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      localImage: {
        static_metadata: {},
      },
      url: '',
      baseUrl: process.env.BASE_URL,
      closeMessage: 'Close',
    };
  },
  computed: {
    imageTitle() {
      return rokkaHelper.imageTitle(this.image);
    },
    stack() {
      return rokkaHelper.getStackByDimensions(1000, 800);
    },
    format() {
      return rokkaHelper.getOriginalCompatibleFormat(this.image);
    },

    labels() {
      return this.getSortedTags('array:labels');
    },
    albums() {
      return this.getSortedTags('array:albums');
    },
    autolabels() {
      if (
        this.localImage.static_metadata &&
        this.localImage.static_metadata['autolabels'] &&
        this.localImage.static_metadata['autolabels']['labels']
      ) {
        return map(
          this.localImage.static_metadata['autolabels']['labels'],
          (a, b) => {
            return b;
          }
        ).sort();
      }
      return [];
    },
    otherMetadata() {
      const metadata = [];

      if (this.localImage.user_metadata) {
        forEach(this.localImage.user_metadata, (a, b) => {
          if (b !== 'array:labels' && b !== 'array:albums') {
            if (b === 'unsplash_artist_id') {
              b = 'Unsplash Artist';
              a = `<a target="_blank" href="https://unsplash.com/@${
                this.localImage.user_metadata['unsplash_artist_id']
              }">${this.localImage.static_metadata.exif.artist ||
                this.localImage.user_metadata['unsplash_artist_id']}</a>`;
            } else if (b === 'unsplash_photo_id') {
              b = 'Unsplash Photo ID';
              a = `<a target="_blank" href="https://unsplash.com/photos/${a}">${a}</a>`;
            }

            metadata.push({ key: b, value: a });
          }
        });
        metadata.sort((a, b) => {
          if (a.key > b.key) {
            return 1;
          }
          return -1;
        });
      }
      return metadata;
    },
    otherStatic() {
      const metadata = [];

      if (this.localImage.static_metadata) {
        forEach(this.localImage.static_metadata, (a, b) => {
          if (
            b !== 'exif' &&
            b !== 'location' &&
            b !== 'video' &&
            b !== 'autolabels'
          ) {
            metadata.push({ key: b, value: a });
          }
        });
        metadata.sort((a, b) => {
          if (a.key > b.key) {
            return 1;
          }
          return -1;
        });
      }
      return metadata;
    },
    dynamicMetadata() {
      const metadata = [];

      if (this.localImage.dynamic_metadata) {
        forEach(this.localImage.dynamic_metadata, (a, b) => {
          metadata.push({ key: b, value: a });
        });
        metadata.sort((a, b) => {
          if (a.key > b.key) {
            return 1;
          }
          return -1;
        });
      }
      return metadata;
    },
    exifdata() {
      const metadata = [];
      if (
        this.localImage.static_metadata &&
        this.localImage.static_metadata.exif
      ) {
        forEach(this.localImage.static_metadata.exif, (a, b) => {
          if (a instanceof Array) {
            a = a.join(', ');
          }
          if (b === 'focallength') {
            a = a + ' mm';
            b = 'Focal length';
          } else if (b === 'focallength_35mm') {
            a = a + ' mm';
            b = 'Focal length in 35mm';
          } else if (b === 'exposure_with_unit') {
            b = 'Exposure';
          } else if (b === 'aperture') {
            a = 'f / ' + a;
          } else if (b === 'exposure') {
            return;
          } else if (b === 'taken') {
            a = dayjs(a).format('ll, HH:mm:ss Z');
          }
          b = capital_letter(b);
          metadata.push({ key: b, value: a });
        });
      }
      return metadata;
    },
    locationdata() {
      const metadata = [];
      if (
        this.localImage.static_metadata &&
        this.localImage.static_metadata.location
      ) {
        forEach(this.localImage.static_metadata.location, (a, b) => {
          if (b === 'coordinates') {
            a = `<a target="_blank" href="https://www.google.com/maps/place/${a}">${a}</a>`;
          } else {
            a = capital_letter(a);
          }
          b = capital_letter(b);

          metadata.push({ key: b, value: a });
        });
      }
      return metadata;
    },
    videodata() {
      const metadata = [];
      if (
        this.localImage.static_metadata &&
        this.localImage.static_metadata.video &&
        this.localImage.static_metadata.video.data
      ) {
        const data = this.localImage.static_metadata.video.data;
        forEach(data, (a, b) => {
          switch (b) {
            case 'ms':
            case 'hours':
            case 'mins':
            case 'secs':
            case 'subsegments':
            case 'height':
            case 'width':
              return;
          }
          b = capital_letter(b.replace(/_/g, ' '));

          metadata.push({ key: b, value: a });
        });

        if (data.width) {
          metadata.push({
            key: 'Dimensions',
            value: `${data.width}x${data.height}`,
          });
        }

        metadata.sort((a, b) => {
          if (a.key > b.key) {
            return 1;
          }
          return -1;
        });
      }
      return metadata;
    },
  },

  watch: {
    index() {
      this.localImage = this.image;
      this.loadImageDataFromRokka();
    },
  },
  methods: {
    closeMessageUpdate(message) {
      this.closeMessage = message;
    },
    beforeOpen() {
      this.localImage = this.image;
      window.addEventListener('keydown', this.keyEvent);
      this.loadImageDataFromRokka();
      this.closeMessage = 'Close';
    },
    beforeClose(e) {
      if (!this.handleKeyEvents) {
        e.stop();
        return;
      }
      this.$emit('modal-image-closed', this.index);
      window.removeEventListener('keydown', this.keyEvent);
    },
    loadImageDataFromRokka() {
      if (this.image && this.image.hash) {
        this.$rokka(this.globalOptions.rokkaKey)
          .sourceimages.get(this.image.organization, this.image.hash, {
            deleted: true,
          })
          .then(response => {
            if (response.body.hash !== this.image.hash) {
              // eslint-disable-next-line
              console.log('Wrong hash loaded. ' + response.body.hash);
              return;
            }
            this.localImage = response.body;
          });
      }
    },
    keyEvent(e) {
      if (!this.handleKeyEvents) {
        return;
      }
      if (e.key === 'ArrowRight') {
        this.$emit('show-modal-image-index', this.index + 1);
      }
      if (e.key === 'ArrowLeft') {
        this.$emit('show-modal-image-index', this.index - 1);
      }
    },
    imgClicked() {
      this.$emit('modal-image-clicked', this.index);
    },
    beforeLabelsUpdate(newTags) {
      newTags = map(newTags, tag => {
        tag.text = tag.text.toLowerCase();
        return tag;
      });
      return newTags;
    },
    getSortedTags(metadata) {
      if (
        this.localImage.user_metadata &&
        this.localImage.user_metadata[metadata]
      ) {
        return map(this.localImage.user_metadata[metadata], a => {
          return { text: a };
        }).sort();
      }
      return [];
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'modal';
</style>
