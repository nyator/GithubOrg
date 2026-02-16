import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import { IoFilter } from "react-icons/io5";
import Filter from "./Filter";

function Header({ query, setQuery }) {

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            query: query
        }
    })

    const onSubmit = (data) => {
        setQuery(data.query.trim().toLowerCase());
        setCurrentPage(1) // Reset to first page on new search
        // console.log(query)
    }

    return (
        <div className="flex items-end gap-3 relative">
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p className="font-medium text-sm ml-2 py-2">Organization Repo On GitHub...</p>
                    <input {...register('query', { required: 'Search field is required' })} placeholder="Search Organizations Repos..." className="input w-full font-medium" />
                    {errors?.query && <div className="absolute ml-2 rounded-2xl underline text-red-500 font-mono text-xs">{errors.query?.message}</div>}
                </form>
            </div>
        </div>
    )
}

export default Header