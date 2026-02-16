
import { VscIssues } from "react-icons/vsc";
import { FaCodeFork } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";



function Card({ repo }) {
    const updatedDate = new Date(repo.updated_at).toLocaleDateString();
    const description = repo.description || 'No description';

    return (
        <a href={repo.html_url} target="_blank" className='z-40 relative bg-[#f5f5f5] border border-black/5 p-5 rounded-xl w-2xs flex flex-col space-y-6 hover:shadow-mShadow hover:scale-[101%] hover:bg-white transition-all ease-in-out duration-300'>
            <div className='flex justify-between items-center'>
                <p className='font-semibold'>{repo.name}</p>
                <span className='text-xs text-[#404040]'>{updatedDate}</span>
            </div>
            <span className="w-full h-0.5 rounded-full bg-black/5"></span>
            <span className='text-xs'>{description}</span>
            <div className="flex justify-between">
                <p className="flex items-center text-xs text-black/70 gap-1"> <VscIssues /> {repo.open_issues_count} issues</p>
                <p className="flex items-center text-xs text-black/70 gap-1"> <FaCodeFork /> {repo.forks_count} forks</p>
                <p className="flex items-center text-xs text-black/70 gap-1"> <FaStar /> {repo.stargazers_count} stars</p>
            </div>
            <span className="w-11/12 absolute bottom-3 left-3 h-0.5 rounded-full bg-black/10"></span>
        </a>
    )
}

export default Card
