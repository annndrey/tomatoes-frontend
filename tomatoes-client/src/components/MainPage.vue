<template>
<div class="mainpage">
  <div class="container mt-5">
    <h4><flash-message transition-name="fade"></flash-message></h4>
    <form v-on:submit.prevent="uploadImages">
      <div class="row mt-4 " v-for="(row, index) in formRows">
	<div class="col">
	  <div class="row mt-4">
	    <div class="col-12">
	      <span class="float-right ml-3"><small>Upoad photo and select a leaf on it</small></span>
	    </div>
	  </div>
	  <div class="row ">
	    <div class="col-5 ">
		<button class="btn btn-outline-secondary float-left" type="button" id="inputAddNewInput" @click="addFileUploadField"><img height="11px" src="@/assets/plus.svg"></button>
		<button class="btn btn-outline-secondary float-left" type="button" id="inputDeleteInput" @click="clearFields(index)"><img height="13px" src="@/assets/trash.svg"></button>
	    </div>
	    <div class="col-7 ">
	      <clipper-upload v-model="row.imageURL" >
		<button class="btn btn-outline-secondary" style="width:100%" type="button"><img height="16px" src="@/assets/aperture.svg"> </button>
	      </clipper-upload>
	    </div>

	  </div>
	  
	  <div class="row mt-2">
	    <div class="col">
	      <div class="card" v-if="row.imageURL">
		<clipper-basic :src="row.imageURL" :preview="'fixed-preview'+index" :ref="'clipper'+index" ></clipper-basic>
		<div class="card-body" v-if="row.objType">
		  {{row.objType}} {{row.diseaseType}}
		</div>
	      </div>
	    </div>
	  </div>
	  
	</div>
      </div>
      
      <div class="row">	
	<div class="col-sm-12">
	  <button :disabled="loading" class="btn btn-block btn-primary mt-2 mb-5" type="submit">Submit</button>
	</div> 
      </div>
     
    </form>
    <p v-if="loading"><img class="loading" src="@/assets/crone.png" height="40px"></p>
  </div>
</div>
</template>

<script>
import Pica from 'pica';
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
    name: 'MainPage',
    data: function() {
	return {
	    formRows: [{
		imageFile: "",
		responseData: "",
		objType: "",
		diseaseType: "",
		imageURL: "",
		fileName: ""
	    }],
	    loading: false
 	}
    },
    created () {
	this.flashSuccess('welcome', {timeout: 2000})
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
	    this.formRows[index].fileName = files[0].name
	},
	uploadImages() {
	    for (const [index, value] of this.formRows.entries()) {
		const pica = Pica()
		let clipperID = 'clipper'+index
		const clipper = this.$refs[clipperID][0]

		let canvas = clipper.clip()
		const dataurl = canvas.toDataURL("image/jpeg", 1)

		//let blob = this.dataURLtoBlob(dataurl)
		var newcanvas =  document.createElement('canvas')
		newcanvas.height = canvas.height * 0.4
		newcanvas.width = canvas.width * 0.4
		
		pica.resize(canvas, newcanvas)
		    .then(result => pica.toBlob(result, 'image/jpeg', 0.90))
		    .then(blob => this.sendImage(blob, value.imageFile.name, index));
		//document.body.appendChild(newcanvas)
		
	    }
	},
	sendImage(blob, fname, index) {
	    let formData = new FormData()
	    formData.append('filename', fname)
	    formData.append('index', index)
	    formData.append('croppedfile', blob, 'cropped.jpg')
	    //formData.append('croppedfile', value.imageFile) 
	    this.loading = true
	    this.flashInfo('Request sent, waiting for a response', {timeout: 5000})
	    this.$axios.post(this.$backendhost+'loadimage', formData, {Headers: {'Content-Type': 'multipart/form-data'}})
		.then(request => { this.parseResponse(request)
				   this.loading = false
				 })
		.catch(request => {this.failedResponse(request)
				   this.loading = false
				  })
	    
	},
	addFileUploadField() {
	    this.formRows.push({
		imageFile: "",
		objType: "",
		diseaseType: "",
		imageURL: "",
		fileName: ""
	    })
	},
	parseResponse(resp) {
	    //this.flashSuccess('File ' + resp.data.filename + " parsed", {timeout: 5000})
	    this.flashSuccess('File successfully parsed', {timeout: 5000})
	    console.log(resp.data)
	    let fito_status = resp.data.fito_status
	    let objtype = resp.data.objtype
	    let index = resp.data.index
	    this.formRows[index].objType = objtype
	    this.formRows[index].diseaseType = fito_status
	    this.formRows[index].fileName = resp.data.filename
	},
	failedResponse(resp) {
	    if (error.response) { 
		if (error.response.status == 429) {
		    this.submitButtonText = 'Try again in a few minutes, max allowed 10 submits in 10 minutes reached'
		    this.flashWarning('Too many requests, try again in a few minutes', {timeout: 5000})
		}
	    }
	    else  {
		this.flashWarning('Network error, server not responding', {timeout: 5000})
	    }
	},
	clearFields(index) {
	    if (this.formRows.length > 1) {
		this.formRows.splice(index, 1)
	    } else {
		this.formRows[index].imageFile = ""
		this.formRows[index].objType = ""
		this.formRows[index].diseaseType = ""
		this.formRows[index].imageURL =  ""
		this.formRows[index].fileName =  ""
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
