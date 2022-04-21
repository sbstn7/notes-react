import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])  
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, import: !note.important}
    // const url = `http://localhost:3001/notes/${id}`
    // axios.put(url, changedNote).then(response => {
    //   setNotes(notes.map(note => note.id !== id ? note : response.data))
    // })
    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data))
      })
  }

  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setNotes(response.data)
      })
  }, [])

  // El codigo comentado a continuación tiene la misma funcionalidad que el que se encuentra arriba
  // con la diferencia de que se extrae la comunicacón con el backend en un módilo separado(ahora Note.js)
  // De esta manera App.js solo se encarga de llamar a las funciones por medio de noteService, que se importó
  // De la misma manera se cambia el código en las demás llamadas al servidos por medio de noteService
  // useEffect(() => {
  //   console.log('effect');
  //   axios
  //     .get('http://localhost:3001/notes')
  //     .then(response => {
  //       console.log('promise fulfilled');
  //       setNotes(response.data)
  //     })
  // }, [])
  // console.log('render', notes.length, 'notes');

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date(),
      important: Math.random < 0.5, 
    }
    noteService
      .create(noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
    // axios
    //   .post('http://localhost:3001/notes', noteObject)
    //   .then(response => {
    //     setNotes(notes.concat(response.data))
    //     setNewNote('')
    //   })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)
  

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => (
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange}/>
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default App

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
