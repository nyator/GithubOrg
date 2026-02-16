

const Button = ({ onClick, children, classname }) => {
    const base = `${classname ?? ''} input p-2 rounded-xl hover:scale-105 transition-all duration-300 ease-in-out`

    return (
        <button onClick={onClick} className={base}>
            {children}
        </button>
    )
}

export default Button