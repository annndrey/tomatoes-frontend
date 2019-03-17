<template>
<div class="mainpage">
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12">
	<form v-on:submit.prevent="uploadImages">
	  <div class="form-row mb-3">
	    <div class="col-md-12">
	      <flash-message transition-name="fade"></flash-message>
	    </div>
	  </div>
	  <div class="form-row mb-3" v-for="(row, index) in formRows">
	    <div class="input-group" >
	      
	      <div class="input-group-prepend">
		<button :disabled="formRows.length > 4" class="btn btn-outline-secondary" type="button" id="inputAddNewInput" @click="addFileUploadField"><img height="11px" src="@/assets/plus.svg"></button>
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
		<!--<img  :src="row.imageURL" class="card-img-top" alt="Loaded Image">-->
		<clipper-fixed :src="row.imageURL" preview="fixed-preview" :ref="'clipper'+index"></clipper-fixed>
		<clipper-preview name="fixed-preview"></clipper-preview>
		<div class="card-body">
		  <h5 class="card-title">{{row.fileMessage}}</h5>
		  <p v-if="row.plantType" class="card-text">Plant Type: {{row.plantType}}<br>Plant Status: {{row.plantStatus}}</p>
		</div>
	      </div>
	    </div>

	  </div>
	  <button :disabled="loading" class="btn btn-block btn-primary mt-2 mb-5" type="submit">Submit</button>
	</form>
	<p v-if="loading"><img class="loading" src="@/assets/crone.png" height="40px"></p>
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
		plantType:"",
		plantStatus:"",
		imageURL: "",
		fileMessage: ""
	    }],
	    loading: false
 	}
    },
    created () {
	//this.flashSuccess('welcome', {timeout: 2000})
    },
    computed: {
	...mapGetters({ currentUser: 'currentUser'})
    },
    methods: {
	dataURLtoBlob(dataurl) {
	    let arr = dataurl.split(',')
	    let mime = arr[0].match(/:(.*?);/)[1]
	    let bstr = atob(arr[1]), n = bstr.length
	    let u8arr = new Uint8Array(n)
	    while(n--){
		u8arr[n] = bstr.charCodeAt(n);
	    }
	    return new Blob([u8arr], {type:mime});
	},
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
		let clipperID = 'clipper'+index
		const clipper = this.$refs[clipperID][0]
		const dataurl = clipper.clip().toDataURL("image/jpeg", 1)
		var blob = this.dataURLtoBlob(dataurl)
		
		let formData = new FormData()
		formData.append('file', value.imageFile)
		formData.append('index', index)
		formData.append('croppedfile', blob, 'cropped.jpg')
		this.loading = true
		// this.flashInfo('Request sent, waiting for a response', {timeout: 5000})
		this.$axios.post('http://trololo.info:5454/api/v1/loadimage', formData, {Headers: {'Content-Type': 'multipart/form-data'}})
		    .then(request => { this.parseResponse(request)
				       this.loading = false
				     })
		    .catch(request => {this.failedResponse(request)
				       this.loading = false
				      })
	    }
	},
	addFileUploadField() {
	    this.formRows.push({
		imageFile: "",
		plantType:"",
		plantStatus:"",
		imageURL:"",
		fileMessage: ""
	    })
	},
	parseResponse(resp) {
	    this.flashSuccess('File ' + resp.data.filename + " parsed", {timeout: 5000})
	    let planttype = resp.data.planttype
	    let plantstatus = resp.data.plantstatus
	    let index = resp.data.index
	    this.formRows[index].plantType = planttype
	    this.formRows[index].plantStatus = plantstatus
	},
	failedResponse(resp) {
	    console.log(resp)
	},
	clearFields(index) {
	    if (this.formRows.length > 1) {
		this.formRows.splice(index, 1)
	    } else {
		this.formRows[index].imageFile = ""
		this.formRows[index].plantType = ""
		this.formRows[index].plantStatus = ""
		this.formRows[index].imageURL =  ""
		this.formRows[index].fileMessage =  ""
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
  .loading {
      position: fixed;
      top: 50%;
      left: 45%;
      z-index: 30001;
      -webkit-animation:spin 2s linear infinite;
      -moz-animation:spin 2s linear infinite;
      animation:spin 2s linear infinite;
  }
  @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
  @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
  @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
</style>
