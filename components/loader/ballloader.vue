<template>
<div class="spinner-container">
  <div class="loader"></div>
</div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.spinner-container{
    @apply absolute top-0 left-0 w-full h-full min-h-[200px] bg-white z-[1] flex justify-center items-center;
}

.loader {
  position: absolute;
  width: 50px;
  height: 50px;
  top: 50%;
  left: 50%;
  margin-top: -10vh;
  margin-left: -10vh;
  perspective: 60vh;
}
.loader:before,
.loader:after {
  content: " ";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.loader:before {
  left: -13.333333333333334vh;
  background: linear-gradient(135deg, rgb(166, 229, 147), rgb(119 195 96));
  transform: translateZ(0vh);
  z-index: 1;
  -webkit-animation: rotation1 1.5s ease-out infinite;
          animation: rotation1 1.5s ease-out infinite;
}
.loader:after {
  right: -13.333333333333334vh;
  background: linear-gradient(135deg, black, grey);
  transform: translateZ(0vh);
  z-index: 1;
  -webkit-animation: rotation2 1.5s ease-out infinite;
          animation: rotation2 1.5s ease-out infinite;
}
@-webkit-keyframes rotation1 {
  25% {
    left: 0;
    transform: translateZ(-10vh);
  }
  50% {
    left: 13.333333333333334vh;
    transform: translateZ(0vh);
  }
  75% {
    left: 0;
    transform: translateZ(20vh);
    z-index: 2;
  }
}
@keyframes rotation1 {
  25% {
    left: 0;
    transform: translateZ(-10vh);
  }
  50% {
    left: 13.333333333333334vh;
    transform: translateZ(0vh);
  }
  75% {
    left: 0;
    transform: translateZ(20vh);
    z-index: 2;
  }
}
@-webkit-keyframes rotation2 {
  25% {
    right: 0;
    transform: translateZ(20vh);
    z-index: 2;
  }
  50% {
    right: 13.333333333333334vh;
    transform: translateZ(0vh);
  }
  75% {
    right: 0;
    transform: translateZ(-10vh);
  }
}
@keyframes rotation2 {
  25% {
    right: 0;
    transform: translateZ(20vh);
    z-index: 2;
  }
  50% {
    right: 13.333333333333334vh;
    transform: translateZ(0vh);
  }
  75% {
    right: 0;
    transform: translateZ(-10vh);
  }
}

</style>