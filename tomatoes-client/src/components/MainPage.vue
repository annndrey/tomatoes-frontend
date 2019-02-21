<template>
<div class="mainpage">
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12">
	
	<p>

	</p>

	<form v-on:submit.prevent="uploadImages">
	  <div class="form-row mb-3">
	    <div class="col-md-12">
	      <flash-message transition-name="fade"></flash-message>
	    </div>
	  </div>
	  <div class="form-row mb-3" v-for="(row, index) in formRows">
	    <div class="input-group" >
	      
	      <div class="input-group-prepend">
		<button class="btn btn-outline-secondary" type="button" id="inputAddNewInput" @click="addFileUploadField"><img height="11px" src="@/assets/plus.svg"></button>
	      </div>
	      
	      <div class="input-group-prepend">
		<button class="btn btn-outline-secondary" type="button" id="inputDeleteInput" @click="clearFields(index)"><img height="13px" src="@/assets/trash.svg"></button>
	    </div>
	      
	      <div class="custom-file">
		<input type="file" class="custom-file-input" @change="setFile($event, index)" id="inputfileField" accept="image/*;capture=camera" aria-describedby="inputFileFieldDescr">
		<label  class="custom-file-label" for="inputFileField" id="inputFileFieldDescr">{{row.fileMessage}}</label>
	      </div>
	    </div>

	    <div class="col-md-12" v-if="row.imageURL">
	      <div class="card">
		<img  :src="row.imageURL" class="card-img-top" alt="Loaded Image">
		<div class="card-body">
		  <h5 class="card-title">{{row.fileMessage}}</h5>
		  <p class="card-text">{{row.responseData}}</p>
		</div>
	      </div>
	    </div>

	  </div>

	  <button class="btn btn-block btn-primary mt-2" type="submit">Submit</button>
	</form>
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
	    formRows: [{
		imageFile:"",
		responseData: "",
		imageURL: "",
		fileMessage: "Take a picture"
	    }],
 	}
    },
    created () {
	//this.flashSuccess('welcome', {timeout: 2000})
    },
    computed: {
	...mapGetters({ currentUser: 'currentUser'})
    },
    methods: {
	setFile(e, index) {
	    // this.clearFields()
	    let files = e.target.files || e.dataTransfer.files
	    if (!files.length) {
		return
	    }
	    this.formRows[index].imageFile = files[0]
	    this.formRows[index].imageURL = URL.createObjectURL(files[0])
	    this.formRows[index].fileMessage = files[0].name
	},
	uploadImages() {
	    console.log('uploading images')
	    for (const [index, value] of this.formRows.entries()) {
		console.log(index, value)
		let formData = new FormData()
		formData.append('file', value.imageFile)
		formData.append('index', index)
		this.$axios.post('http://trololo.info:5454/api/v1/loadimage', formData, {headers: {'Content-Type': 'multipart/form-data'}})
		    .then(request => this.parseResponse(request))
		    .catch(request => this.failedResponse(request))
	    }
	},
	addFileUploadField() {
	    this.formRows.push({
		imageFile: "",
		responseData:"",
		imageURL:"",
		fileMessage: "Take a picture"
	    })
	},
	parseResponse(resp) {
	    this.flashSuccess('File ' + resp.data.filename + " parsed", {timeout: 2000})
	    let response = resp.data.response
	    let index = resp.data.index
	    this.formRows[index].responseData = response
	},
	failedResponse(resp) {
	    console.log(resp)
	},
	clearFields(index) {
	    if (this.formRows.length > 1) {
		this.formRows.splice(index, 1)
	    } else {
		this.formRows[index].imageFile = ""
		this.formRows[index].responseData = ""
		this.formRows[index].imageURL =  ""
		this.formRows[index].fileMessage =  "Take a picture"
	    }
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
