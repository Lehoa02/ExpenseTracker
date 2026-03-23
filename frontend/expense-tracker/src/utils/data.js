import {
    LuLayoutDashboard,
    LuDollarSign,
    LuHandCoins,
    LuLogOut,
} from 'react-icons/lu';

export const SIDE_MENU_DATA = [
    {
        id: "01",
        name: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        name: "Income",
        icon: LuDollarSign,
        path: "/income",
    },
    {
        id: "03",
        name: "Expense",
        icon: LuHandCoins,
        path: "/expense",
    },
    {
        id: "06",
        name: "Logout",
        icon: LuLogOut,
        path: "logout",
    },
];