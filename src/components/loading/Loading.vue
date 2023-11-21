<template>
    <div class="loading_container">
        <div class="loading_component"></div>
        <div class="loading_intermediate">
            <div class="loading_component"></div>
            <div class="loading_component"></div>
        </div>
        <div class="loading_component"></div>
    </div>
</template>

<style scoped>
.loading_intermediate {
    display: flex;
    justify-content: space-between;
    width: 3rem;
}
.loading_component {
    background-color: darkgreen;
    height: .7rem;
    width: .7rem;
    border-radius: 100%;
}
.loading_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 3rem;
    aspect-ratio: 1/1;
    animation: loading 2s forwards infinite;
}

@keyframes loading {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>