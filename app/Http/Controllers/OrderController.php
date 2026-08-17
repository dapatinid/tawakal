<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('items')->with('user')->latest()->paginate(48);
        return inertia('Orders/Index', compact('orders'));
    }

    public function show(Order $order)
    {
        $order->load([
            'user',
            'items.product',
            'payments' => fn($q) => $q
                ->where('mutation_type', 'Penjualan')
                ->orderBy('date_payment', 'asc'),
        ]);
        $products = \App\Models\Product::select('id','name','price')->orderBy('name')->get();
        return Inertia::render('Orders/Show', [
            'order' => $order,
            'products' => $products,
        ]);
    }

    public function checkout(Request $request)
    {
        $payload = $request->validate([
            'customer_id' => 'required|string',
            'payment_method' => 'required|in:cash,transfer',
            'sub_total' => 'required|numeric',
            'discount' => 'required|numeric',
            'charge' => 'required|numeric',
            'tax' => 'required|numeric',
            'grand_total' => 'required|numeric',
            'paid_amount' => 'required|numeric',
            'change_amount' => 'required|numeric',
            'items' => 'required|array',
        ]);

        $order = Order::create([
            'customer_id' => $payload['customer_id'] ?? null,
            'payment_method' => $payload['payment_method'],
            'sub_total' => $payload['sub_total'],
            'discount' => $payload['discount'],
            'charge' => $payload['charge'],
            'tax' => $payload['tax'],
            'grand_total' => $payload['grand_total'],
            'paid_amount' => $payload['paid_amount'],
            'change_amount' => $payload['change_amount'],
            'meta' => [],
        ]);

        foreach ($payload['items'] as $it) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $it['product_id'] ?? null,
                'name' => $it['name'],
                'price' => $it['price'],
                'quantity_mins' => $it['quantity_mins'],
                'subtotal' => $it['price'] * $it['quantity_mins'],
            ]);
        }

        return response()->json(['ok'=>true,'order_id'=>$order->id]);
    }
}