import {useEffect, useState} from "react";
import api from "@/lib/axios";
import {cn} from "@/lib/utils";

// @ts-ignore
export function StockAlert({ productId }) {
    const [stock, setStock] = useState(null)

    useEffect(() => {
        api.get(`/warehouse?productId=${productId}`)
            .then(res => setStock(res.data))
    }, [productId])

    if (!stock) return null

    return (
        <div className={cn(
            "p-2 rounded-md text-sm",
            // @ts-ignore
            stock.inStock < 10 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
        )}>
            {stock.inStock} в наличии, {stock.expected} ожидается
        </div>
    )
}