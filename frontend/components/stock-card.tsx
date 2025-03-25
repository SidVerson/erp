import {Product} from "@/lib/types"

export function StockCard({
                              product,
                              inStock,
                              expected
                          }: {
    product: Product
    inStock: number
    expected: number
}) {
    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-medium">{product.name}</h3>
            <div className="mt-2">
                <p>В наличии: {inStock}</p>
                <p>Ожидается: {expected}</p>
            </div>
        </div>
    )
}