import React, { Component } from 'react';
import firebase from 'firebase';

import FileUpload from './FileUpload';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      user: null,
      pictures: []
    }

    this.handleAuth = this.handleAuth.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.renderLoginButton = this.renderLoginButton.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
  }

  /**
   * Este metodo se llama automaticamente cuando el componente ha sido renderizado en el DOM
   */
  componentWillMount(){
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user })
    })

    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      })
    })
  }

  handleAuth(){
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión.`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }

  handleLogout(){
    firebase.auth().signOut()
      .then(result => console.log(`${result.user.email} ha cerrado sesión.`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`))
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
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        //image: task.snapshot.downloadURL
      }

      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);
    })
  }

  renderLoginButton(){
    // Si está logueado
    if(this.state.user){
      return(
        <div>
          <img width="150" src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <p>Hola {this.state.user.displayName}!</p>
          <button onClick={this.handleLogout}>Salir</button>
          <FileUpload onUpload={this.handleUpload}/>

          {
            this.state.pictures.map(picture => {
              <div>
                <img src={picture.image} /> <br/>
                <img src={picture.photoURL} alt={picture.displayName} /> <br/>
                <span>{picture.displayName}</span>
              </div>
            })
          }
        </div>
      )
    }else{
      // Si no está logeado
      return(
        <button onClick={this.handleAuth}>Login con Google</button>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Mini Gram</h1>
        </header>
        <div className="App-intro">
          {this.renderLoginButton()}
        </div>
      </div>
    );
  }
}

export default App;
