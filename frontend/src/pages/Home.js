import React from 'react'
import Header from '../components/Header'
import Hero from './Hero'
import Services from './Services'
import FeaturedMenu from './FeaturedMenu'
import BarDrinks from './BarDrinks'
import RoomBooking from './RoomBooking'
import TableReservation from './TableReservation'
import Testimonials from './Testimonials'
import Gallery from './Gallery'

export default function Home() {
  return (
    <>
      <Header></Header>
      <Hero></Hero>
      <Services></Services>
      <FeaturedMenu></FeaturedMenu>
      <BarDrinks></BarDrinks>
      <RoomBooking></RoomBooking>
      <TableReservation></TableReservation>
      <Testimonials></Testimonials>
      <Gallery></Gallery>
    </>
  )
}
