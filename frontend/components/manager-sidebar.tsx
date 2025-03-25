import {BadgeDollarSign, PackageSearch, ShoppingBasket, Users, Warehouse} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {logout} from "@/lib/auth";
import {useRouter} from "next/navigation";

// Menu items.
const items = [
    {
        title: "Продажи",
        url: "/manager/sales",
        icon: BadgeDollarSign,
    },
    {
        title: "Закупки",
        url: "/manager/procurements",
        icon: PackageSearch,
    },
    {
        title: "Склад",
        url: "/manager/warehouse",
        icon: Warehouse,
    },
    {
        title: "Товары",
        url: "/manager/products",
        icon: ShoppingBasket,
    },
    {
        title: "Поставщики",
        url: "/manager/suppliers",
        icon: Users,
    },
]

export function ManagerSidebar() {
    const router = useRouter()
    const log = () => {
        logout()
        router.push('/login')
    }
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Меню менеджера</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                                <SidebarMenuButton onClick={log}>
                                     Выйти
                                </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
