'use client'
import {StockCard} from "@/components/stock-card";
import {useEffect, useState} from "react";
import {Product} from "@/lib/types";
import api from "@/lib/axios";

export default function WarehousePage() {
    const [stockData, setStockData] = useState<Array<{
        product: Product;
        inStock: number;
        expected: number;
    }>>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get('/warehouse/all');
            setStockData(response.data);
        }
        fetchData();
    }, []);

    return (
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-6">Управление складом</h1>
            {stockData.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">Нет данных о складе</p>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {stockData.length !== 0 && stockData.map(item => (
                    <StockCard
                        key={item.product.id}
                        product={item.product}
                        inStock={item.inStock}
                        expected={item.expected}
                    />
                ))}
            </div>
        </div>
    )
}