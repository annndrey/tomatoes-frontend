<template>
<div class="mainpage">
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
	
	<p>
	  <flash-message transition-name="fade"></flash-message> 
	</p>
	<form>
	  <div class="custom-file">
	    <input type="file" class="custom-file-input" @change="setFile" id="inputfileField" accept="image/*;capture=camera">
	    <label  class="custom-file-label" for="inputFileField">{{fileMessage}}</label>
	  </div>
	</form>
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-12">
	<img v-if="imageURL" :src="imageURL" class="img-thumbnail" alt="Loaded Image">
      </div>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
    name: 'MainPage',
    data: function() {
	return {
	    imageFile:"",
	    responseData: "",
	    imageURL: "",
	    fileMessage: "Добавьте изображение"
	}
    },
    created () {
	this.flashSuccess('welcome', {timeout: 2000})
    },
    computed: {
	...mapGetters({ currentUser: 'currentUser'})
    },
    methods: {
	setFile(e) {
	    let files = e.target.files || e.dataTransfer.files
	    if (!files.length) {
		return
	    }
	    this.imageFile = files[0]
	    this.imageURL = URL.createObjectURL(this.imageFile)
	    this.fileMessage = this.imageFile.name

	},
	uploadImage () {

	},
	clearFields() {
	}
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
  }
  span.error{
  color:#e74c3c;
  font-size:20px;
  display:flex;
  justify-content:center;
  }
  .blank_row
  .statusmessage {
  height: 22px !important; /* overwrites any other rules */
  }
  h3 {
  margin: 40px 0 0;
  }
  ul {
  list-style-type: none;
  padding: 0;
  }
  li {
  display: inline-block;
  margin: 0 10px;
  }
  a {
  color: #42b983;
  }
</style>
