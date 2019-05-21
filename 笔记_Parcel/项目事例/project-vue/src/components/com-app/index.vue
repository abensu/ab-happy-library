<template>
    <div>
        <h1>App</h1>
        <com-list />
    </div>
</template>

<script>
    import ComList from '../com-list/index';

    export default {
        name        : 'App',
        components  : { ComList },
    }
</script>