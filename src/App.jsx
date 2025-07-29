"use client"

import { useEffect, useState } from "react"
import Home from "./Pages/Home"
import Carousel from "./Pages/Gallery"
import FullWidthTabs from "./Pages/Tabs"
import Footer from "./Pages/Footer"
import Chat from "./components/ChatAnonim"
import AOS from "aos"
import "aos/dist/aos.css"

function App() {
  useEffect(() => {
    AOS.init()
    AOS.refresh()
  }, [])

  /**
   * State untuk memicu refresh galeri.
   * Nilainya akan diubah setiap kali upload gambar berhasil.
   */
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0)

  /**
   * Fungsi untuk memicu refresh galeri.
   * Akan dipanggil dari komponen UploadImage.
   */
  const handleGalleryRefresh = () => {
    setGalleryRefreshKey((prevKey) => prevKey + 1)
  }

  return (
    <>
      <Home />

      {/* Meneruskan galleryRefreshKey dan handleGalleryRefresh ke Carousel */}
      <Carousel galleryRefreshKey={galleryRefreshKey} />
      <FullWidthTabs />

      <div id="Mesh1"></div>

      <div
        className="lg:mx-[12%] lg:mt-[-5rem] lg:mb-20 hidden lg:block"
        id="ChatAnonim_lg"
        data-aos="fade-up"
        data-aos-duration="1200"
      >
        <Chat />
      </div>

      <Footer />
    </>
  )
}

export default App
