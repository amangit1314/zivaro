"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useUserStore } from "@/zustand/user-store";
import { useSellerStore } from "@/zustand/seller-store";
import { BarChart3, Package, DollarSign, ShoppingCart, Star, Plus, TrendingUp, Pause, Play, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

type Tab = "overview" | "products" | "orders" | "ads" | "analytics";

export default function SellerDashboard() {
  const { user, isAuthenticated } = useUserStore();
  const { seller, products, orders, analytics, loading, fetchSeller, fetchProducts, fetchOrders, fetchAnalytics, createShop, createProduct, deleteProduct } = useSellerStore();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showSetup, setShowSetup] = useState(false);
  const [shopName, setShopName] = useState("");
  const [shopDesc, setShopDesc] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", comparePrice: "", discount: "", categoryId: "", imageUrl: "", tags: "" });

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchSeller(user.id);
    }
  }, [isAuthenticated, user?.id, fetchSeller]);

  useEffect(() => {
    if (seller?.id) {
      fetchProducts(seller.id);
      fetchOrders(seller.id);
      fetchAnalytics(seller.id);
    }
  }, [seller?.id, fetchProducts, fetchOrders, fetchAnalytics]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">Sign in to access Seller Dashboard</h1>
          <Link href="/login" className="inline-block px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">Sign In</Link>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto">
              <BarChart3 className="w-10 h-10 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Become a Seller on Zivaro</h1>
              <p className="text-gray-500 mt-2">Create your shop, list products, and start earning</p>
            </div>
            {!showSetup ? (
              <Button onClick={() => setShowSetup(true)} className="bg-red-600 hover:bg-red-700 rounded-xl px-8 py-3">Start Selling</Button>
            ) : (
              <form onSubmit={async (e) => { e.preventDefault(); await createShop(user!.id, shopName, shopDesc); }} className="space-y-4 text-left">
                <div>
                  <Label className="text-sm font-medium">Shop Name</Label>
                  <Input value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="e.g., Fashion Hub" className="mt-1 rounded-xl" required />
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <Input value={shopDesc} onChange={(e) => setShopDesc(e.target.value)} placeholder="Tell customers about your shop..." className="mt-1 rounded-xl" />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 rounded-xl">{loading ? "Creating..." : "Create Shop"}</Button>
              </form>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statCards = [
    { label: "Products", value: products.length, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Orders", value: orders.length, icon: ShoppingCart, color: "bg-emerald-50 text-emerald-600" },
    { label: "Revenue", value: `$${(analytics?.totalRevenue || 0).toFixed(0)}`, icon: DollarSign, color: "bg-amber-50 text-amber-600" },
    { label: "Rating", value: (analytics?.avgRating || 0).toFixed(1), icon: Star, color: "bg-purple-50 text-purple-600" },
  ];

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProduct({
      sellerId: seller.id,
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      comparePrice: newProduct.comparePrice ? parseFloat(newProduct.comparePrice) : undefined,
      discount: newProduct.discount ? parseInt(newProduct.discount) : 0,
      imageUrl: newProduct.imageUrl || undefined,
      tags: newProduct.tags ? newProduct.tags.split(",").map((t) => t.trim()) : [],
    });
    setNewProduct({ name: "", description: "", price: "", comparePrice: "", discount: "", categoryId: "", imageUrl: "", tags: "" });
    setShowAddProduct(false);
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-600",
    CONFIRMED: "bg-blue-50 text-blue-600",
    PROCESSING: "bg-indigo-50 text-indigo-600",
    SHIPPED: "bg-purple-50 text-purple-600",
    DELIVERED: "bg-green-50 text-green-600",
    CANCELLED: "bg-red-50 text-red-600",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Seller Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">{seller.shopName} {seller.isVerified && <span className="text-blue-500">verified</span>}</p>
          </div>
          <Button onClick={() => { setShowAddProduct(true); setActiveTab("products"); }} className="bg-red-600 hover:bg-red-700 rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
          {(["overview", "products", "orders", "analytics"] as Tab[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{tab}</button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
              {orders.length === 0 ? <p className="text-sm text-gray-500 py-8 text-center">No orders yet</p> : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-900">#{order.orderNumber?.slice(0, 12) || order.id.slice(0, 8)}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">${order.totalPrice?.toFixed(2)}</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[order.status] || "bg-gray-100"}`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h2>
              {analytics?.revenueByMonth ? (
                <div className="flex items-end gap-2 h-40">
                  {analytics.revenueByMonth.map((m) => {
                    const maxRev = Math.max(...analytics.revenueByMonth.map((r) => r.revenue), 1);
                    const height = (m.revenue / maxRev) * 100;
                    return (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-gray-500">${m.revenue.toFixed(0)}</span>
                        <div className="w-full bg-red-500 rounded-t-md transition-all" style={{ height: `${Math.max(height, 4)}%` }} />
                        <span className="text-[10px] text-gray-400">{m.month}</span>
                      </div>
                    );
                  })}
                </div>
              ) : <p className="text-sm text-gray-500 py-8 text-center">No data yet</p>}
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <div className="space-y-4">
            {showAddProduct && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Product</h2>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Name</Label><Input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required className="mt-1 rounded-xl" /></div>
                  <div><Label>Price ($)</Label><Input type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required className="mt-1 rounded-xl" /></div>
                  <div><Label>Compare Price ($)</Label><Input type="number" step="0.01" value={newProduct.comparePrice} onChange={(e) => setNewProduct({ ...newProduct, comparePrice: e.target.value })} className="mt-1 rounded-xl" /></div>
                  <div><Label>Discount (%)</Label><Input type="number" value={newProduct.discount} onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })} className="mt-1 rounded-xl" /></div>
                  <div className="md:col-span-2"><Label>Description</Label><Input value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="mt-1 rounded-xl" /></div>
                  <div><Label>Image URL</Label><Input value={newProduct.imageUrl} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })} placeholder="https://..." className="mt-1 rounded-xl" /></div>
                  <div><Label>Tags (comma separated)</Label><Input value={newProduct.tags} onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })} placeholder="fashion, summer" className="mt-1 rounded-xl" /></div>
                  <div className="md:col-span-2 flex gap-2">
                    <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 rounded-xl">{loading ? "Creating..." : "Create Product"}</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddProduct(false)} className="rounded-xl">Cancel</Button>
                  </div>
                </form>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Product</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Price</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Rating</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Sales</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product: any) => (
                      <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image src={product.imageUrl} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.category?.name || "Uncategorized"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm font-bold">${product.price}</span></td>
                        <td className="px-6 py-4"><div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-current" /><span className="text-sm">{product.rating}</span></div></td>
                        <td className="px-6 py-4"><span className="text-sm">{product.salesCount}</span></td>
                        <td className="px-6 py-4">
                          <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-lg font-semibold text-gray-900">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Order</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Customer</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Date</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Total</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: any) => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-6 py-4"><p className="text-sm font-medium text-gray-900">#{order.orderNumber?.slice(0, 12) || order.id.slice(0, 8)}</p></td>
                        <td className="px-6 py-4"><p className="text-sm text-gray-600">{order.email || order.User?.email}</p></td>
                        <td className="px-6 py-4"><p className="text-sm text-gray-600">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</p></td>
                        <td className="px-6 py-4"><p className="text-sm font-bold">${order.totalPrice?.toFixed(2)}</p></td>
                        <td className="px-6 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100"}`}>{order.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics */}
        {activeTab === "analytics" && analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold mb-4">Revenue Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between"><span className="text-gray-500">Total Revenue</span><span className="font-bold text-green-600">${analytics.totalRevenue.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Pending Payout</span><span className="font-bold">${analytics.pendingPayout.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Commission Rate</span><span className="font-medium">{(analytics.commissionRate * 100).toFixed(0)}%</span></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold mb-4">Orders by Status</h2>
              <div className="space-y-2">
                {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[status] || "bg-gray-100"}`}>{status}</span>
                    <span className="text-sm font-bold">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:col-span-2">
              <h2 className="text-lg font-bold mb-4">Top Products</h2>
              <div className="space-y-3">
                {analytics.topProducts.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200">
                        <Image src={p.imageUrl} alt={p.name} width={40} height={40} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">${p.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{p.salesCount} sales</p>
                      <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-current" /><span className="text-xs">{p.rating}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
