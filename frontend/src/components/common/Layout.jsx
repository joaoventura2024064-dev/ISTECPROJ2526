import { Outlet } from 'react-router-dom';
import Header from './Header';
import CustomScrollDiv from './CustomScrollDiv';

/**
 * Componente de Layout Base.
 * Define a estrutura principal da página com Cabeçalho fixo e conteúdo scrollável customizado.
 */
export default function Layout() {
    return (
        <div className="h-screen overflow-hidden flex flex-col bg-background-300">
            <Header />
            <div className="flex-1 w-full overflow-hidden relative">
                <CustomScrollDiv className="w-full h-full">
                    <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Outlet />
                    </main>
                </CustomScrollDiv>
            </div>
        </div>
    );
}
