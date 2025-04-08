"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { motion, useAnimation, useInView } from "framer-motion"

interface ScrollAnimationWrapperProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
}

export function ScrollAnimationWrapper({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: ScrollAnimationWrapperProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, threshold: 0.25 })

  const getDirectionVariants = () => {
    switch (direction) {
      case "up":
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }
      case "down":
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 },
        }
      case "left":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 },
        }
      case "right":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        }
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }
    }
  }

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={getDirectionVariants()}
      transition={{ duration: 0.5, delay: delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
