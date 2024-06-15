import { motion } from "framer-motion"

function Motion(Component) {
    return function HOC() {
        return (
            <div className="ml-14 w-full h-full flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0.1, scale: 0.95 }}
                    animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                    transition={{ duration: 0.2 }}
                    className="w-9/10 min-h-9/10 h-auto rounded-[30px] relative flex flex-col justify-center items-center bg-background-color-lower-alpha"
                >
                    <Component />
                </motion.div>
            </div>
        )
    }
}

export default Motion