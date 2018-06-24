import React, { Component } from 'react';
import firebase from 'firebase';

class FileUpload extends Component{
	constructor(){
		super();
		this.state = {
			uploadValue: 0,
			picture: null
		}

		this.handleUpload = this.handleUpload.bind(this)
	}

	handleUpload(event){
		/**
		 * Archivo enviado a través del formulario.
		 */
		const file = event.target.files[0];

		/**
		 * Diretorio en el storage de firebase en donde vamos a subir los archivos.
		 */
		const storageRef = firebase.storage().ref(`/fotos/${file.name}`); 
		
		/**
		 * Subir el archivo al storage.
		 */
		const task = storageRef.put(file);

		/**
		 * Metodo de firebase que se llama a medida que el archivo se vaya subiendo.
		 */
		task.on('state_changed', snapshot => {
			let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			this.setState({
				uploadValue: percentage
			})
		}, error => {
			console.log(`Error: ${error.message}`);
		}, (/* Cuando el archivo se ha subido por completo */) => {
			this.setState({
				uploadValue: 100,
				picture: task.snapshot.downloadURL
			})
		})
	}

	render(){
		return(
			<div>
				<progress value={this.state.uploadValue} max="100">{this.state.uploadValue}</progress> <br />
				<input type="file" onChange={this.handleUpload} /> <br />
				<img width="320" src={this.state.picture} alt="" />
			</div>
		)
	}
}

export default FileUpload;