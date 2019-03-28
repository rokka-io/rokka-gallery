<template>
  <div id="modal">
    <form @submit="save">
      <TitleLine title="Settings / Credentials" modal-name="modal-settings" />

      <div id="main">
        <div class="left">
          <div class="left-content">
            <div v-if="title">
              <b>{{ title }}</b>
            </div>

            <div v-if="!rokkaKey">
              Please provide your rokka api key and organization:
            </div>
            <div>
              <label class="field-label" for="rokkaOrg"
                >rokka Organization:</label
              >
              <input
                id="rokkaOrg"
                v-model.trim="rokkaOrgField"
                class="field"
                size="64"
              />
            </div>
            <div>
              <label class="field-label" for="rokkaApi">rokka Api-Key: </label>
              <input
                id="rokkaApi"
                v-model.trim="rokkaKeyField"
                class="field"
                type="password"
                size="64"
              />
            </div>
          </div>
          <div class="footer">
            <button
              class="button cancel"
              @click="$modal.hide('modal-settings')"
            >
              Cancel
            </button>
            <input type="submit" class="button" value="Save" />
          </div>
        </div>
        <div class="data"></div>
      </div>
    </form>
  </div>
</template>

<script>
import { EventBus } from '../eventBus';
import TitleLine from './Modal/TitleLine';

export default {
  components: { TitleLine },
  props: {
    rokkaOrg: {
      type: String,
      required: true,
    },
    rokkaKey: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      rokkaOrgField: this.rokkaOrg,
      rokkaKeyField: this.rokkaKey,
    };
  },
  methods: {
    save(e) {
      e.preventDefault();
      EventBus.$emit(
        'credentials-updated',
        this.rokkaKeyField,
        this.rokkaOrgField
      );
      this.$emit('close');
    },
  },
};
</script>
<style lang="scss" scoped>
@import '_modal.scss';

form {
  height: 100%;
}
</style>
