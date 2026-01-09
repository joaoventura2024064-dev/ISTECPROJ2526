import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">S.E.I.O.S</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li><Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
