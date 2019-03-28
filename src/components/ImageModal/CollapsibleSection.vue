<template>
  <div v-if="data === true || data.length > 0" :key="keyName">
    <div
      :class="['title', openState ? 'open' : null]"
      @click="sectionOpenClose"
    >
      <Icon :id="openState ? 'caret-down' : 'caret-right'" class="icon--50" />

      {{ title }}
    </div>
    <div v-if="openState" :style="!openState ? 'display: none' : ''">
      <slot>
        <span v-for="(label, index) in data" :key="label + index">
          <div>
            <div class="field-label">{{ label.key }}:</div>
            {{ ' ' }}<span v-html="label.value" />
          </div>
        </span>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollapsibleSection',
  props: {
    data: {
      type: [Array, Boolean],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    keyName: {
      type: String,
      required: true,
    },
    defaultState: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return { openState: this.defaultState };
  },
  created() {
    let state = JSON.parse(
      localStorage.getItem('rokkaSection_' + this.keyName)
    );
    if (state === null) {
      state = this.defaultState;
    }
    this.openState = state;
  },
  methods: {
    sectionOpenClose() {
      this.openState = !this.openState;
      localStorage.setItem('rokkaSection_' + this.keyName, this.openState);
    },
  },
};
</script>

<style scoped lang="scss">
.field-label {
  display: inline;
}
#modal {
  .title {
    cursor: pointer;
    font-weight: bold;
    &:hover {
      background-color: #f7f7f5;
    }
    &.open {
      background-color: #f7f7f5;
    }
    &::selection {
      background-color: transparent;
      color: black;
    }
  }
}
</style>
