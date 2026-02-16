import { useState } from "react"
import FilterButton from "./filterButton"

import { LuTimer } from "react-icons/lu";
import { LuGitFork } from "react-icons/lu";
import { TiStarFullOutline } from "react-icons/ti";
import { VscIssues } from "react-icons/vsc";


const Filter = ({ timeFilter, setTimeFilter, starsFilter, setStarsFilter, forksFilter, setForksFilter, issuesFilter, setIssuesFilter }) => {
    const [openFilter, setOpenFilter] = useState(null)

    // Filter options
    const timeOptions = ['Latest', 'oldest', '1 month ago', '3 months ago', '6 months ago', '1 year ago']
    const starsOptions = ['Stars', '1+', '10+', '100+', '1000+']
    const forksOptions = ['Forks', '1+', '10+', '100+', '1000+']
    const issuesOptions = ['Issues', 'open', 'closed', 'none']

    return (
        <div className="flex gap-4 flex-wrap">
            <FilterButton
                icon={<LuTimer />}
                name="Time"
                options={timeOptions}
                selected={timeFilter}
                onSelect={setTimeFilter}
                open={openFilter === 'Time'}
                setOpen={(isOpen) => setOpenFilter(isOpen ? 'Time' : null)}
            />
            <FilterButton
                icon={<TiStarFullOutline />}
                name="Stars"
                options={starsOptions}
                selected={starsFilter}
                onSelect={setStarsFilter}
                open={openFilter === 'Stars'}
                setOpen={(isOpen) => setOpenFilter(isOpen ? 'Stars' : null)}
            />
            <FilterButton
                icon={<LuGitFork />}
                name="Forks"
                options={forksOptions}
                selected={forksFilter}
                onSelect={setForksFilter}
                open={openFilter === 'Forks'}
                setOpen={(isOpen) => setOpenFilter(isOpen ? 'Forks' : null)}
            />
            <FilterButton
                icon={<VscIssues />}
                name="Issues"
                options={issuesOptions}
                selected={issuesFilter}
                onSelect={setIssuesFilter}
                open={openFilter === 'Issues'}
                setOpen={(isOpen) => setOpenFilter(isOpen ? 'Issues' : null)}
            />
        </div>
    )
}

export default Filter