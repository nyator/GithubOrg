import Button from "./Button"
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowUp } from "react-icons/io"
import { useEffect, useState } from "react";


const Pagination = ({ currentPage, totalPages, onNext, onPrev }) => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <div className="z-50">
            <div className="fixed bottom-5 left-2/5 flex flex-row items-center space-x-3 bg-[#f8f8f8] border border-black/10 p-1 rounded-2xl">
                <Button children={<IoIosArrowBack />} onClick={onPrev} />
                <p>{currentPage} / {totalPages}</p>
                <Button children={<IoIosArrowForward />} onClick={onNext} />
            </div>
            <Button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                classname={`fixed bottom-5 right-10 z-10 ${showButton ? 'block ' : 'hidden'}`}
            >
                <IoIosArrowUp />
            </Button>

        </div>
    )
}

export default Pagination