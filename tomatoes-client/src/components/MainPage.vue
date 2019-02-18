<template>
<div class="mainpage">
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12">
	
	<p>
	  <flash-message transition-name="fade"></flash-message> 
	</p>

	<form v-on:submit.prevent="uploadImages">
	  <div class="input-group">
	    <div class="input-group-prepend">
	      <button class="btn btn-outline-secondary" type="button" id="inputAddNewInput" @click="addFileUploadField"><img src="@/assets/plus.svg"></button>
	    </div>

	    <div class="custom-file">
	      <input type="file" class="custom-file-input" @change="setFile" id="inputfileField" accept="image/*;capture=camera" aria-describedby="inputFileFieldDescr">
	      <label  class="custom-file-label" for="inputFileField" id="inputFileFieldDescr">{{fileMessage}}</label>
	    </div>
	  </div>
	  <button class="btn btn-block btn-primary mt-2" type="submit">отправить</button>
	</form>
      </div>
    </div>

    
    <div class="row" v-if="imageURL">
      <div class="col-md-12">
	<div class="card">
	  <img  :src="imageURL" class="card-img-top" alt="Loaded Image">
	  <div class="card-body">
	    <h5 class="card-title">{{this.fileMessage}}</h5>
	    <p class="card-text">{{this.responseData}}</p>
	  </div>
	</div>
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
	    this.clearFields()
	    let files = e.target.files || e.dataTransfer.files
	    if (!files.length) {
		return
	    }
	    this.imageFile = files[0]
	    this.imageURL = URL.createObjectURL(this.imageFile)
	    this.fileMessage = this.imageFile.name
	},
	uploadImages() {
	    console.log('uploading images11')
	    this.flashSuccess('uploading files', {timeout: 2000})
	    let formData = new FormData()
	    formData.append('file', this.imageFile)
	    this.$axios.post('http://trololo.info:5454/api/v1/loadimage', formData, {headers: {'Content-Type': 'multipart/form-data'}})
	    .then(request => this.parseResponse(request))
	    .catch(request => this.failedResponse(request))
	},
	addFileUploadField () {
	    console.log('add file upload field')
	},
	parseResponse(resp) {
	    console.log(resp.data)
	    this.responseData = resp.data
	},
	failedResponse(resp) {
	    console.log(resp)
	},
	clearFields() {
	    this.imageFile = ""
	    this.responseData = ""
	    this.imageURL =  ""
	    this.fileMessage =  "Добавьте изображение"
	}
    }

}
</script>


<style>
  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
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
  height: 22px !important; 
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
