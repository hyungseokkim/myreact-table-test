import React from 'react';
import logo from './logo.svg';
import './App.css';
import UseReactTable from './Components/UseSortReactTable';
import UseVirtualizedReactTable from './Components/UseVirtualizedReactTable';


const App = () => {
  return (
    <div className="App">
      <UseVirtualizedReactTable/>
    </div>
  );
}

export default App;
