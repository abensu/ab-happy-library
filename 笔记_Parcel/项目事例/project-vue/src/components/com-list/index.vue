<style scoped>
    .com-list .item {background: blue;color: #fff;}
    .com-list .btn {background: orange;}
</style>

<template>
    <div class="com-list">
        <div class="item" v-for="item in datas" v-bind:key="item.id">
            <img src="./res/1.png" />
            <span>{{item.txt}}</span>
        </div>
        <div class="btn" @click="toUpdate">增加</div>
    </div>
</template>

<script>
    export default {

        name : 'com-list',

        data () {

            return {
                datas : [
                    {
                        id  : Math.random(),
                        txt : Math.random(),
                    }
                ]
            };
        },

        methods : {

            /**
             * 更新次数
             */
            toUpdate () {

                this.datas.push( {
                    id  : Math.random(),
                    txt : Math.random(),
                } );
            }
        }
    }
</script>