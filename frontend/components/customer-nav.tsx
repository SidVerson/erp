import Link from 'next/link'
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function CustomerNav() {
  return (
    <nav className="flex space-x-2">
      <Link
        href="/my-orders"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "px-3 py-2 hover:bg-muted"
        )}
      >
        Мои заказы
      </Link>
    </nav>
  )
}