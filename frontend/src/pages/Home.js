import React from 'react'
import Hero from './Hero'
import Services from './Services'
import FeaturedMenu from './FeaturedMenu'
import BarDrinks from './BarDrinks'
import RoomBooking from './RoomBooking'
import TableReservation from './TableReservation'
import Testimonials from './Testimonials'
import GallerySlider from '../components/GallerySlider'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedMenu />
      <BarDrinks />
      <RoomBooking />
      {/* <TableReservation /> */}
      <Testimonials />
      <GallerySlider />
    </>
  )
}
