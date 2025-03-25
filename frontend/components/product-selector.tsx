'use client'
import {Product} from '@/lib/types'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Plus, Trash} from 'lucide-react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export function ProductSelector({
                                    products,
                                    selectedItems,
                                    onChange
                                }: {
    products: Product[]
    selectedItems: Array<{ productId: number; quantity: number }>
    onChange: (items: Array<{ productId: number; quantity: number }>) => void
}) {
    const addItem = () => onChange([...selectedItems, { productId: 0, quantity: 1 }])

    const updateItem = (index: number, field: 'productId' | 'quantity', value: any) => {
        const newItems = [...selectedItems]
        newItems[index][field] = value
        onChange(newItems)
    }

    const removeItem = (index: number) => {
        onChange(selectedItems.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-4">
            {selectedItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                    <Select
                        value={item.productId.toString()}
                        onValueChange={v => updateItem(index, 'productId', Number(v))}
                    >
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Выберите товар" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map(product => (
                                <SelectItem
                                    key={product.id}
                                    value={product.id.toString()}
                                    disabled={selectedItems.some(i => i.productId === product.id)}
                                >
                                    {product.name} ({product.stock?.inStock} в наличии)
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                        className="w-32"
                    />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                    >
                        <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addItem}
            >
                <Plus className="mr-2 h-4 w-4" /> Добавить товар
            </Button>
        </div>
    )
}