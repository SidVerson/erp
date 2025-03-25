'use client'
import Link from 'next/link'
import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"
import {usePathname} from 'next/navigation'

export function ManagerNav() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname.startsWith(path)

    return (
        <nav className="flex space-x-2">
            {[
                { href: '/manager/sales', label: 'Продажи' },
                { href: '/manager/procurements', label: 'Закупки' },
                { href: '/manager/warehouse', label: 'Склад' },
                { href: '/manager/products', label: 'Товары' },
                { href: '/manager/suppliers', label: 'Поставщики' }
            ].map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        buttonVariants({ variant: isActive(item.href) ? 'default' : 'ghost' }),
                        "px-3 py-2",
                        isActive(item.href) && 'bg-primary text-primary-foreground'
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    )
}