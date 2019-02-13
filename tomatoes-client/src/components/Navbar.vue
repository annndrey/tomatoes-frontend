<template>
  <nav class="navbar navbar-expand-sm navbar-light bg-light fixed-top">
    <a class="navbar-brand" href="#">AI APP CLIENT</a>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapseMenu" aria-controls="collapseMenu" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="collapseMenu">
      <ul class="navbar-nav mr-auto">
	<li v-if="currentUser" class="nav-item">
	  <router-link @click.native="closeMenu($event)" class="btn nav-link" :to="{ name: 'MainPage' }"> Главня </router-link>
	</li>
	<li v-if="currentUser" class="nav-item">
	  <router-link @click.native="closeMenu($event)" class="btn nav-link" to="/logout"> Выйти </router-link>
	</li>
	<li v-else class="nav-item">
	  <router-link @click.native="closeMenu($event)" class="btn nav-link" to="/login"> Войти </router-link>
	</li>
      </ul>
      
      <span v-if="currentUser" class="navbar-text">
	{{ currentUser.name }} <span class="badge badge-primary">Hello</span>
      </span>
    </div>
  </nav>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Navbar',
    computed: {
	...mapGetters({ currentUser: 'currentUser'}),
    },
    methods: {
        closeMenu($event) {
	    $($event.currentTarget).closest('.navbar-collapse').collapse('hide')
        }
    }
}
</script>

<style lang="scss" scoped>

.btn-logout {
  background-color: #837A75;
  border-color: #837A75;
  color: #fff;
}

</style>
