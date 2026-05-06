import React, { useEffect } from 'react'
import Hero from './Hero'
import Services from './Services'
import FeaturedMenu from './FeaturedMenu'
import BarDrinks from './BarDrinks'
import RoomBooking from './RoomBooking'
import TableReservation from './TableReservation'
import Testimonials from './Testimonials'
import GallerySlider from '../components/GallerySlider'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
      easing: 'ease-out',
    });
  }, []);

  return (
    <>
      <div data-aos="fade">
        <Hero />
      </div>
      <div data-aos="fade-up">
        <Services />
      </div>
      <div data-aos="fade-up">
        <FeaturedMenu />
      </div>
      <div data-aos="fade-up">
        <BarDrinks />
      </div>
      <div data-aos="fade-up">
        <RoomBooking />
      </div>
      {/* <TableReservation /> */}
      <div data-aos="fade-up">
        <Testimonials />
      </div>
      <div data-aos="fade-up">
        <GallerySlider />
      </div>
    </>
  )
}
