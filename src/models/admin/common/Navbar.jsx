import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

const Navbar = () => {
    const [isSticky, setIsSticky] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsSticky(latest >= 80);
    });

    return (
        <motion.nav
            initial={{ y: 0 }}
            animate={{
                y: 0,
                height: isSticky ? 64 : 80,
            }}
            transition={{
                duration: 0.2,
                ease: "easeOut",
            }}
            className="fixed left-0 top-0 z-50 flex w-full items-center bg-info shadow-md"
        >
            {/* Navbar content */}
        </motion.nav>
    );
};

export default Navbar;