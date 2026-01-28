import React from 'react'
import Head from '../../common/header/Head'
import Hero from '../../home/hero/Hero'
import Homes from '../../home/mainContent/homes/Home'
import Discover from '../../home/discover/Discover'
import Footer from '../../common/footer/Footer'
import UserNavbar from '../Navbar/UserNavbar'
import News2 from '../../News2'

function UserHome() {
  return (
    <div>
      <UserNavbar/>
      <Head/>
      <Hero/>
      <Homes/>
      {/* <News2/> */}
      {/* <Discover/> */}
      <Footer/>
    </div>
  )
}

export default UserHome
