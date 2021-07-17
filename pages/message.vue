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
    <a href="#">
      massage = >
      {{ user.name }}
    </a>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
    layout: 'message',
  data() {
    return {
      user: {},
      users: []
    };
  },
  computed: mapGetters({
    // users: "users/getAllUsers",
    // getUserById: "users/getUserById",
  }),
  mounted() {
    var id = this.$route.params.slug;
    if (typeof id !== "undefined") {
      this.user = this.getUserById(parseInt(id));
    }
  },
  methods: {},
};
</script>
