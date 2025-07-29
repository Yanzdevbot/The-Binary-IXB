"use client"

import { useEffect, useState } from "react"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import Typography from "@mui/material/Typography"
import { useSpring, animated } from "@react-spring/web"
import CloseIcon from "@mui/icons-material/Close"
import { getGitHubFile } from "../lib/github"

export default function ButtonRequest({ galleryRefreshKey }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const fade = useSpring({
    opacity: open ? 1 : 0,
    config: {
      duration: 200,
    },
  })

  const [images, setImages] = useState([])

  const fetchImagesFromGitHub = async () => {
    try {
      const { content } = await getGitHubFile("data/images.json")
      const imageData = JSON.parse(content)
      /** Sort images by timestamp in descending order (newest first) */
      imageData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setImages(imageData)
    } catch (error) {
      console.error("Error fetching images from GitHub:", error)
      setImages([]) /** Ensure images is an empty array on error */
    }
  }

  useEffect(() => {
    fetchImagesFromGitHub()
  }, [galleryRefreshKey]) /** Tambahkan galleryRefreshKey sebagai dependency */

  return (
    <div>
      <button onClick={handleOpen} className="flex items-center space-x-2 text-white px-6 py-4" id="SendRequest">
        <img src="/Request.png" alt="Icon" className="w-6 h-6 relative bottom-1 " />
        <span className="text-base lg:text-1xl">Request</span>
      </button>

      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <animated.div style={fade}>
          <Box className="modal-container">
            <CloseIcon
              style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer", color: "grey" }}
              onClick={handleClose}
            />
            <Typography id="spring-modal-description" sx={{ mt: 2 }}>
              <h6 className="text-center text-white text-2xl mb-5">Request</h6>
              <div className="h-[22rem] overflow-y-scroll overflow-y-scroll-no-thumb">
                {images.map((imageData, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-5 py-2 mt-2"
                    id="LayoutIsiButtonRequest"
                  >
                    <img
                      src={imageData.url || "/placeholder.svg"}
                      alt={`Image ${index}`}
                      className="h-10 w-10 blur-sm"
                    />
                    <span className="ml-2 text-white">{new Date(imageData.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="text-white text-[0.7rem] mt-5">
                Note : Jika tidak ada gambar yang sudah anda upload silahkan reload
              </div>
            </Typography>
          </Box>
        </animated.div>
      </Modal>
    </div>
  )
}
