'use client'
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {ManagerSidebar} from "@/components/manager-sidebar";

export default  function Layout({children}) {



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