import { SideItem } from './SideItems';
import { sideRoutes } from "../utils/sideRoutes";

// Navegación principal del sidebar, genera enlaces según el rol del usuario
const Navigation = ({ collapsed, userRole }) => (
    <nav className="p-2 space-y-1 mt-2 flex-grow overflow-hidden">
        {sideRoutes(userRole).map(item => (
            <SideItem
                key={item.path}
                item={item}
                collapsed={collapsed}
            />
        ))}
    </nav>
);

export { Navigation }