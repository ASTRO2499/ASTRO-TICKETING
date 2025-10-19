import { motion } from 'framer-motion'

export function MotionWrap({ children }: { children: React.ReactNode }){
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default MotionWrap
