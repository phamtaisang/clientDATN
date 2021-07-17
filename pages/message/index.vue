<template>
  <div>
    <h2>Users</h2>
    <ul>
      <li v-for="(user, index) in users" :key="index">
        <!-- <span :class="{ done: user.done }"> -->
          {{ user.name }}
      </li>
      <!-- <li><input placeholder="What needs to be done?" @keyup.enter="addTodo"></li> -->
    </ul>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  layout: "message",
  computed: mapGetters({
    // users: 'users/getAllUsers'
  }),
  methods: {
  }
}
</script>
