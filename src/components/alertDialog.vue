<template>
    <teleport to="body">
        <div id="wave-alert">
            <div class="alert-body">
                <p>{{message}}</p>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
import {defineComponent, watch} from "vue";

export default defineComponent({
    name: "alertDialog",
    props: {
        error: Boolean,
        message: String,
        timeout: {
            type: Number,
            default: 1500
        }
    },
    setup(props){

        watch(()=>props.error, ()=>{
            const alertElem = document.getElementById('wave-alert');
            if(alertElem){
                alertElem.style.display = "block"
                setTimeout(()=>{
                    alertElem.style.display = "none";
                }, props.timeout)
            }

        })

        return {

        }
    }
})

</script>

<style scoped>
#wave-alert{
    position: fixed;
    top: 10px;
    right: 10px;
    min-width: 300px;
    /*min-height: 50px;*/
    border-radius: 20px;
    background-color: #ffffff;
    box-shadow: 2px 1px 2px rgba(0,0,0,.5);
    z-index: 9999;
    display: none;
    transition: display 3s;
}
.alert-body{
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    padding: 10px 20px
}
</style>