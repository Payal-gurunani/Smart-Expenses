import './App.css'
import { useEffect, useState } from 'react';
import LightModeIcon from '@mui/icons-material/LightMode'; // Sun
import DarkModeIcon from '@mui/icons-material/DarkMode';   // Moon
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { IconButton } from '@mui/material'
import { Routes,Route } from 'react-router-dom'
import Layout from './Layout'
function App() {
 const [isDark, setIsDark] = useState(true)

 useEffect(()=>{
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme){
    setIsDark(savedTheme === 'dark')
  }
 },[])

 useEffect(()=>{
  if (isDark) {
    document.documentElement.classList.add('dark');
  }else{
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', isDark? 'dark':'light')
 },[isDark])

 const toggleTheme = () =>{
  setIsDark(!isDark)
 }

 const theme = createTheme({
  palette : {
    mode : isDark ? 'dark' : 'light'
  }
 })
  return (
   <ThemeProvider theme={theme} >
  <CssBaseline />
    <div className={` flex flex-col  min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>

      <div className='absolute top-4 right-4'>
      <IconButton
         onClick={toggleTheme}
           sx={{
    backgroundColor: 'primary.main',
    color: 'white',
    '&:hover': {
      backgroundColor: 'primary.dark',
    },
    m: 1,
    p: 1,
  }}
        // className="p-2 bg-blue-400 text-white rounded-l-full m-4"
      >
       {isDark ?  (
          <LightModeIcon className="h-5 w-5 mr-1" />
        ) : (
          <DarkModeIcon className="h-5 w-5 mr-1" />
        )}
      </IconButton>

    </div>

       <Routes>
      <Route path='/' element = {<Layout />}>

      </Route>
    </Routes>
    </div>

  </ThemeProvider>


  )
}

export default App
