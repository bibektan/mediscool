import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import Editor from './components/Editor';

function App() {
  useState(()=>{
    console.log('first')
  },[])

  return (
    <div className='container mt-3'>
      <Editor />
    </div>
  );
}

export default App;
