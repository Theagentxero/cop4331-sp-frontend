<template>
    <div class="home">
        <h1>Howdy {{userName}}</h1>
    </div>
</template>

<script>
export default {
    name: 'home',
    components: {},
    data(){
        return{}
    },
    computed:{
        userName: function(){
            return this.$store.getters.getFirstName;
        }
    }
}
</script>
