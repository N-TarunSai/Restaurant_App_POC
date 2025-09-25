import React from 'react'
import MenuList from '../components/MenuList'
import MenuCarousel from '../components/MenuCarousel'
import { MENU } from '../data/menu'
import '../styles/menu.css'

export default function Home(){
  return (
    <>
      <MenuCarousel />
      <center> 
        <div id="MENU">
        <MenuList items={MENU} />
        </div> 
      </center>
      
    </>
  )
}
