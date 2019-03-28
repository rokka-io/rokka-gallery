<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 20" class="loader">
    <polygon
      class="first"
      points="14.8 20 10.7 17.9 15.3 9 19.9 0 24 2.1 19.4 11 14.8 20"
    />
    <polygon
      class="second"
      points="4.1 20 0 17.9 4.7 9 9.3 0 13.4 2.1 8.8 11 4.1 20"
    />
  </svg>
</template>

<script>
export default {
  name: 'Loader',
};
</script>

<style lang="scss" scoped>
.loader {
  display: block;
  width: 40px;
  height: 40px;
  margin: 0 auto;

  position: relative;

  overflow: visible;

  .first,
  .second {
    transform-origin: 50%;
    transform-box: fill-box;
    fill: currentColor;
  }

  .first {
    animation: loader-reverse 1.7s infinite ease-out;
  }

  .second {
    animation: loader 1.7s infinite ease-out;
  }
}

@keyframes loader {
  50% {
    transform: translateX(0);
  }
  60% {
    transform: translateX(38%);
  }
  80% {
    transform: translateX(38%) rotate(180deg);
  }
  100% {
    transform: translateX(0) rotate(180deg);
  }
}

@keyframes loader-reverse {
  50% {
    transform: translateX(0);
  }
  60% {
    transform: translateX(-38%);
  }
  80% {
    transform: translateX(-38%) rotate(180deg);
  }
  100% {
    transform: translateX(0) rotate(180deg);
  }
}
</style>
