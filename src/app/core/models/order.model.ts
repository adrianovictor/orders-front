export interface Order {
  id: number,
  customerId: number,
  customerName: string,
  orderDate: Date,
  orderStatus: number,
  totalAmount: number,
  items: Array<OrderItem>
};

export interface OrderItem {
    id: number,
    orderId: number,
    productId: number,
    productName: string,
    quantity: number,
    unitPrice: number,
    totalPrice: number
};