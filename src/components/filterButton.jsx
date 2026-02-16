import { MdKeyboardArrowDown } from "react-icons/md";


const FilterButton = ({ icon, options, selected, onSelect, open, setOpen }) => {
    return (
        <>
            <div className="relative">
                <button onClick={() => setOpen(!open)} className="input flex items-center gap-2 font-medium text-md hover:shadow-mShadow2 hover:bg-white transition-all ease-in-out duration-300">
                    {icon}
                    {selected}
                    <MdKeyboardArrowDown className={` transition-all ease-in duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>
                {open ?
                    <div className="absolute option left-0 z-50">
                        {options.map((option, index) => (
                            <p key={index} className="option-item capitalize" onClick={() => {
                                onSelect(option)
                                setOpen(false)
                            }}>
                                {option}
                            </p>
                        ))}
                    </div>
                    : null
                }
            </div>
        </>
    )
}

export default FilterButton