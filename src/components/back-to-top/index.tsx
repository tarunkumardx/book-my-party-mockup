import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { backToTop } from '@/assets/images'

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className={`justify-content-end d-flex back-to-top ${isVisible ? 'visible' : ''}`}>
      <button type="button" className="btn" onClick={scrollToTop}>
        <Image src={backToTop} width="15" height="15" alt="" />
      </button>
    </div>
  )
}

export default BackToTopButton
