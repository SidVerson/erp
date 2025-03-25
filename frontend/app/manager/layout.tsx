'use client'
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {ManagerSidebar} from "@/components/manager-sidebar";
import {getCurrentUser} from "@/lib/auth";
import {useRouter} from "next/navigation";

export default  function Layout({children}) {
    const user =  getCurrentUser()
    const router = useRouter()

    if (!user) {
        router.push('/login')
    }
    
    if (user.role === 'customer') {
        router.push('/my-orders')
    }
    return (
        <>
            <SidebarProvider>
                <ManagerSidebar/>
                <main className={'w-full'}>
                    <SidebarTrigger/>
                    {children}
                </main>
            </SidebarProvider>
        </>
    )
}