export const EliteEduLogo = ({ className = "w-10 h-10" }: { className?: string }) => {
    return (
        <img
            src="/images/logo.png"
            alt="EliteEdu Logo"
            className={`${className} object-contain`}
        />
    )
}
