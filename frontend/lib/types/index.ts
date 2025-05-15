export interface User {
    id: number
    email: string
    role: 'admin' | 'manager' | 'customer'
}
export interface Order {
    id: number;
    clientId: number;
    status: 'pending' | 'in_progress' | 'completed';
    shipmentDate: string;
    totalPrice: number;
    items: OrderItem[];
}


export interface OrderItem {
    product: Product
    quantity: number
    price: number
}


export interface Procurement {
    id: number;
    supplierId: number;
    productId: number;
    quantity: number;
    deliveryDate: string;
    price: number;
    delivered: boolean;
}
export interface Product {
    id: number
    name: string
    price: number
    supplier?: Supplier
    stock?: {
        inStock: number
        expected: number
    }
}

export interface Supplier {
    id: number;
    name: string;
    address: string;
}