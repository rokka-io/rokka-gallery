<template>
  <div>
    <div class="images-list">
      <gallery
        :images="galleryImages"
        :index="galleryIndex"
        @close="galleryClosed"
        @onslide="slideComplete"
      >
      </gallery>
      <ImageModal
        :all-albums="allAlbums"
        :all-tags="allTags"
        :handle-key-events="galleryIndex === null"
        :image="images[modalIndex]"
        :index="modalIndex"
        :global-options="globalOptions"
        @modal-image-clicked="modalImageClicked"
        @modal-image-closed="modalImageClosed"
        @show-modal-image-index="showModalImage"
      />
      <div
        v-for="(image, index) in images"
        :key="`${image.organization}.${image.hash}`"
        class="images-list__item"
      >
        <ImageBlock
          :index="index"
          :image="image"
          :rokka-org="globalOptions.rokkaOrg"
          @show-modal-image-index="showModalImage"
        />
      </div>
    </div>
    <footer>
      <p v-if="cursorNext">
        <button @click="$emit('load-more')">
          {{ searching ? 'Loading ... ' : 'Load More' }}
        </button>
      </p>
      <p>Powered by <a href="https://rokka.io">rokka</a>.</p>
    </footer>
  </div>
</template>

<script>
import VueGallery from 'vue-gallery';
import ImageModal from './ImageModal';

import ImageBlock from './ImageBlock';
import { EventBus } from '../eventBus';
import { map, forEach } from 'lodash-es';

export default {
  components: {
    ImageBlock,
    ImageModal,
    gallery: VueGallery,
  },
  props: {
    images: {
      type: Array,
      required: true,
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
    searching: {
      type: Boolean,
      default: false,
    },
    cursorNext: {
      type: String,
      default: null,
    },
  },
  data() {
    if (window.location.hash) {
      window.setTimeout(() => {
        const hash = window.location.hash.substring(1);
        const i = this.images.findIndex((image) => image.short_hash === hash);
        if (i >= 0) {
          this.showModalImage(i);
        }
      }, 300);
    }

    return {
      galleryIndex: null,
      modalIndex: null,
    };
  },
  computed: {
    galleryImages() {
      return map(this.images, (image) => {
        let format = null;
        if (image['mimetype'] === 'video/mp4') {
          format = 'mp4';
        }
        const data = {
          href: this.$rokkaRenderUrl(
            image,
            this.globalOptions.rokkaOrg,
            1500,
            1000,
            format
          ),
        };
        if (image['mimetype'] === 'video/mp4') {
          data.type = 'video/mp4';
          data.poster = this.$rokkaRenderUrl(
            image,
            this.globalOptions.rokkaOrg,
            1500,
            1000,
            'jpg'
          );
        }
        return data;
      });
    },
  },
  watch: {
    images() {
      console.log('foo');
    },
  },
  created() {
    //those events are a little bit ugly...
    EventBus.$on('show-gallery', () => {
      this.galleryIndex = 0;
      this.modalIndex = null;
    });

    EventBus.$on('image-added', (hash, image) => {
      let imageInList = false;

      forEach(this.images, function (value) {
        if (value.hash === hash) {
          imageInList = true;
        }
      });
      if (imageInList === false) {
        this.images.unshift(image);
      }
    });
  },
  methods: {
    showModalImage(index) {
      let showIndex = index;
      if (index >= this.images.length) {
        showIndex = 0;
      } else if (index < 0) {
        showIndex = this.images.length - 1;
      }
      this.modalIndex = showIndex;

      this.$modal.show('modal-image');
    },

    modalImageClosed() {
      this.modalIndex = null;
    },

    modalImageClicked(index) {
      this.galleryIndex = index;
    },

    slideComplete(a) {
      if (!a.slide.hasClickListener) {
        const img = a.slide.getElementsByClassName('slide-content')[0];
        img.addEventListener('click', (e) => {
          if (e.target.tagName.toLowerCase() === 'a') {
            return;
          }
          this.showModalImage(a.index);
          this.galleryIndex = null;
        });
        a.slide.hasClickListener = true;
      }
    },
    galleryClosed() {
      if (this.modalIndex !== null) {
        const foo = this.modalIndex;
        setTimeout(() => {
          this.showModalImage(foo);
        }, 100);
      }
      this.galleryIndex = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.images-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 234px);
  grid-gap: $spacing-unit-tiny;
}

.images-list__item {
  display: flex;

  height: 280px;
  &::before {
    content: '';
    display: block;
    width: 0;
    padding-bottom: 100%;
  }
}
.image {
  float: left;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border: 1px solid #ebebeb;
  margin: 5px;
}
footer {
  text-align: center;
}
footer button {
  background-color: transparent;
  border: 0;
  color: #6ea644;
  cursor: pointer;
}
</style>
