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
    <alert-dialog :error="error" :message="message"/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import AlertDialog from "@/components/alertDialog.vue";

export default defineComponent({
    name: 'HomeView',
    components: {AlertDialog},
    setup(){
        const error = ref(false);
        const message = ref("");
        const {ethereum} = window;
        let accounts = [];

        const checkIfWalletIsConnected = ()=>{
            if(!ethereum){
                error.value = !error.value ;
                message.value = "Metemask not detected! Ensure you have MetaMask installed";
            }else{
                error.value = !error.value ;
                message.value = "Hurray! Metamask is installed"
            }
        }

        const wave =  async ()=>{
            if(ethereum){
                try{
                    accounts = await ethereum.request({ method: "eth_accounts" });
                    if(accounts.length > 0){
                        error.value = !error.value;
                        message.value = `Found account ${accounts[0]}`;
                    }else{
                        throw new Error("No Authorized account found")
                    }
                }catch (e: any){
                    error.value = !error.value ;
                    message.value = e.message;
                }
            }
        }

        onMounted(()=>{
            checkIfWalletIsConnected();
        })

        return {
            wave,
            error,
            message
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
