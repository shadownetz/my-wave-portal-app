<template>
    <div class="mainContainer">

        <div class="dataContainer">
            <div class="header">
                👋 Hey there!
            </div>

            <div class="bio">
                I am Jude and I worked on a facial authentication system so that's pretty cool right?
                Connect your Ethereum wallet and wave at me!
            </div>

            <button class="waveButton" @click=wave>
                Wave at Me
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HomeView',
    setup(){
        const wave = ()=>{
            //
        }

        return {
            wave
        }
    }
});
</script>

<style scoped>
.mainContainer {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 64px;
}

.dataContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 600px;
    padding-top: 200px;
}

.header {
    text-align: center;
    font-size: 32px;
    font-weight: 600;
}

.bio {
    text-align: center;
    color: rgb(10,10,10);
    margin-top: 16px;
}

.waveButton {
    cursor: pointer;
    margin-top: 30px;
    padding: 8px;
    border: 0;
    border-radius: 5px;
    box-shadow: 1px 1px 3px #000000;
}
</style>
