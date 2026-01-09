import logo from '../assets/medcei-logo.png';
import RecoverPasswordCard from '../components/auth/RecoverPasswordCard';

export default function RecoverPassword() {
    return (
        <div className="flex flex-col items-center justify-center gap-10 w-full max-w-[550px]">
            <div className="w-[320px] h-[258px] flex items-center justify-center">
                <img src={logo} alt="Medcei Logo" className="w-full h-full object-contain" />
            </div>
            <RecoverPasswordCard />
        </div>
    );
}
