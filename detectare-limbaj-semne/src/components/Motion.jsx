import { motion } from "framer-motion"

function Motion(Component) {
    return function HOC(props) {
        return (
            <div className="ml-14 w-full h-full flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0.1, scale: 0.95 }}
                    animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                    exit={{ opacity: 0.1, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="w-9/10 h-9/10 rounded-[30px] relative flex flex-col overflow-hidden overflow-y-auto no-scrollbar bg-background-color-lower-alpha"
                >
                    <Component {...props} />
                </motion.div>
            </div>
        )
    }
}

export default Motion