import ResetPasswordCard from '../components/auth/ResetPasswordCard';

export default function ResetPassword() {
    return (
        <div className="flex flex-col items-center justify-center gap-10 w-full max-w-[550px] select-none">
            <div className="w-[320px] h-[258px] flex items-center justify-center">
                <img src="/medcei-logo.webp" alt="Medcei Logo" className="w-full h-full object-contain" fetchPriority="high" />
            </div>
            <ResetPasswordCard />
        </div>
    );
}
