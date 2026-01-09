import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Check,
  Zap,
  Crown,
  Users,
  ArrowRight,
  ShieldCheck,
  Flame,
  Plus,
  Settings,
  X,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Lock,
  Clock,
  Headphones,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  tags: string[];
  rating: number;
  reviews: number;
  featured?: boolean;
  type: "community" | "software" | "course";
  joinLink: string;
}

// Components
const PremiumCard = ({
  product,
  onDelete,
  onEdit,
}: {
  product: ProductCardProps;
  onDelete?: (id: string) => void;
  onEdit?: (product: ProductCardProps) => void;
}) => {
  const isSoftware = product.type === "software";
  const isCommunity = product.type === "community";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative h-full w-full overflow-hidden rounded-2xl border border-white/5 bg-card hover:border-primary/50 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.2)] transition-all duration-300 flex flex-col"
    >
      {onDelete && (
        <div className="absolute top-2 right-2 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="w-8 h-8 bg-black/50 backdrop-blur-md border border-white/10 hover:bg-primary hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(product);
            }}
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="w-8 h-8 bg-red-500/80 backdrop-blur-md border border-red-500/20"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
      {/* Image Section */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10 opacity-60" />
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          {product.featured && (
            <Badge className="bg-primary hover:bg-primary/90 text-white border-none shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
              <Crown className="w-3 h-3 mr-1" /> Featured
            </Badge>
          )}
          {isSoftware && (
            <Badge
              variant="secondary"
              className="bg-black/50 backdrop-blur-md border border-white/10 text-white"
            >
              <Zap className="w-3 h-3 mr-1" /> Software
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 right-3 z-20">
          <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/20 text-white font-bold text-sm shadow-lg">
            {product.price === "Free"
              ? "Free"
              : product.price.startsWith("$")
                ? product.price
                : `$${product.price}`}
            {product.price !== "Free" && (
              <span className="text-xs text-muted-foreground font-normal ml-1">
                /mo
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow relative z-20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <div className="flex text-primary">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3.5 h-3.5",
                    i < Math.floor(product.rating)
                      ? "fill-primary"
                      : "text-muted opacity-30",
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews})
            </span>
          </div>
          {isCommunity && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
              Online
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 flex-grow whitespace-pre-line">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 text-white/70 border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <Button
          asChild
          className="w-full bg-white/5 hover:bg-primary hover:text-white border border-white/10 text-white transition-all duration-300 group/btn"
          variant="outline"
        >
          <a
            href={product.joinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            Join Now
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </a>
        </Button>
      </div>
    </motion.div>
  );
};

export default function PremiumCardsPage() {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem("admin_auth") === "true",
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductCardProps | null>(
    null,
  );

  const [newProduct, setNewProduct] = useState<Partial<ProductCardProps>>({
    type: "community",
    rating: 5,
    reviews: 0,
    tags: [],
    featured: false,
    joinLink: "https://",
    price: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // WebSocket for instant real-time updates
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "product_added") {
        setProducts((prev) => [message.data, ...prev]);
      } else if (message.type === "product_updated") {
        setProducts((prev) =>
          prev.map((p) => (p.id === message.data.id ? message.data : p)),
        );
      } else if (message.type === "product_deleted") {
        setProducts((prev) => prev.filter((p) => p.id !== message.data.id));
      }
    };

    ws.onclose = () => {
      // Reconnect after 2 seconds if connection lost
      setTimeout(() => {
        fetchProducts();
      }, 2000);
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (isAdmin) localStorage.setItem("admin_auth", "true");
  }, [isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAdmin(false);
  };

  const resetForm = () => {
    setNewProduct({
      type: "community",
      rating: 5,
      reviews: 0,
      tags: [],
      featured: false,
      joinLink: "https://",
      price: "",
    });
    setEditingProduct(null);
    setDialogOpen(false);
  };

  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.description) return;

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newProduct.title,
            description: newProduct.description,
            price: newProduct.price || "Free",
            image:
              newProduct.image ||
              "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
            tags: newProduct.tags || ["General"],
            rating: newProduct.rating || 5,
            reviews: newProduct.reviews || 0,
            featured: newProduct.featured || false,
            type: newProduct.type || "software",
            joinLink: newProduct.joinLink || "#",
          }),
        });
        if (res.ok) {
          await fetchProducts();
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newProduct.title,
            description: newProduct.description,
            price: newProduct.price || "Free",
            image:
              newProduct.image ||
              "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
            tags: newProduct.tags || ["General"],
            rating: newProduct.rating || 5,
            reviews: newProduct.reviews || 0,
            featured: newProduct.featured || false,
            type: newProduct.type || "software",
            joinLink: newProduct.joinLink || "#",
          }),
        });
        if (res.ok) {
          await fetchProducts();
        }
      }
    } catch (error) {
      console.error("Failed to save product:", error);
    }

    resetForm();
  };

  const handleEdit = (product: ProductCardProps) => {
    setNewProduct(product);
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-bold text-xl tracking-tight">
              Pure<span className="text-primary">Tickets</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {isAdmin && (
              <button
                onClick={handleLogout}
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Logout Admin
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                if (!open) {
                  resetForm();
                } else {
                  setDialogOpen(true);
                }
              }}
            >
              <DialogTrigger asChild>
                {isAdmin && (
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-orange-600 text-white font-bold"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Product
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    {editingProduct
                      ? "Edit Product"
                      : "Add New Premium Product"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Product Title</Label>
                      <Input
                        placeholder="e.g. Phantom Checker"
                        className="bg-black/50 border-white/10"
                        value={newProduct.title || ""}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (Monthly)</Label>
                      <Input
                        placeholder="e.g. 99.00"
                        className="bg-black/50 border-white/10"
                        value={newProduct.price || ""}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tags (comma separated)</Label>
                      <Input
                        placeholder="e.g. Aged, Verified, Premium"
                        className="bg-black/50 border-white/10"
                        value={
                          (newProduct as any).tagsInput ??
                          newProduct.tags?.join(", ") ??
                          ""
                        }
                        onChange={(e) => {
                          setNewProduct({
                            ...newProduct,
                            tagsInput: e.target.value,
                            tags: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter((t) => t),
                          } as any);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select
                        className="w-full h-10 px-3 rounded-md bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        value={(newProduct as any).category || ""}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            category: e.target.value,
                          } as any)
                        }
                      >
                        <option value="" className="bg-zinc-900">Select category...</option>
                        <option value="Aged Accounts" className="bg-zinc-900">Aged Accounts</option>
                        <option value="Verified Accounts" className="bg-zinc-900">Verified Accounts</option>
                        <option value="Premium Accounts" className="bg-zinc-900">Premium Accounts</option>
                        <option value="Bulk Accounts" className="bg-zinc-900">Bulk Accounts</option>
                        <option value="Special Offers" className="bg-zinc-900">Special Offers</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Join Link</Label>
                      <Input
                        placeholder="https://..."
                        className="bg-black/50 border-white/10"
                        value={newProduct.joinLink || ""}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            joinLink: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="What makes this special?"
                        className="bg-black/50 border-white/10 h-32"
                        value={newProduct.description || ""}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input
                        placeholder="https://images.unsplash.com/..."
                        className="bg-black/50 border-white/10"
                        value={newProduct.image || ""}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            image: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-primary"
                          checked={newProduct.featured || false}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              featured: e.target.checked,
                            })
                          }
                        />
                        <span className="text-sm">Featured</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hover:bg-white/5"
                      onClick={() => setEditingProduct(null)}
                    >
                      Cancel
                    </Button>
                  </DialogTrigger>
                  <Button
                    onClick={handleAddProduct}
                    className="bg-primary hover:bg-orange-600 text-white px-8"
                  >
                    {editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Hero + Products Unified Section */}
      <section className="relative overflow-hidden">
        {/* Unified Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute top-20 right-20 w-40 h-40 bg-violet-500/20 rounded-full blur-[80px]" />
        <div className="absolute top-[40%] left-10 w-48 h-48 bg-blue-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-[60%] right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-1/3 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px]" />

        <div className="container mx-auto px-6 pt-24 pb-20 relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/80">
                The #1 free ticket brokers
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center max-w-4xl mx-auto mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                Leading{" "}
              </span>
              <span className="bg-gradient-to-r from-primary via-violet-400 to-primary bg-clip-text text-transparent">
                PureTickets
              </span>
              <br />
              <span className="bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Take your ticket reselling to the next level with PureTickets.
              Join a community of motivated resellers, get access to powerful
              tools, premium accounts, and the support you need to maximize
              profits.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-500/90 text-white px-8 py-6 text-lg font-semibold shadow-[0_0_40px_-10px_hsl(var(--primary))] hover:shadow-[0_0_50px_-5px_hsl(var(--primary))] transition-all duration-300"
              onClick={() =>
                document
                  .getElementById("products-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white px-8 py-6 text-lg font-semibold"
              onClick={() =>
                document
                  .getElementById("footer-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Learn More
            </Button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {/* Secure Transactions */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Secure Transactions
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All purchases are processed through encrypted payment gateways
                </p>
              </div>
            </div>

            {/* Instant Delivery */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Instant Delivery
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Receive your account credentials immediately after purchase
                </p>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Headphones className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  24/7 Support
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our customer service team is always available to assist you
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Products Grid - Same Section */}
        <div
          id="products-section"
          className="container mx-auto px-6 py-16 pb-24 relative z-10"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <PremiumCard
                  key={product.id}
                  product={product}
                  onDelete={isAdmin ? handleDelete : undefined}
                  onEdit={isAdmin ? handleEdit : undefined}
                />
              ))}
              {products.length === 0 && (
                <div className="col-span-full py-24 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="footer-section"
        className="border-t border-white/5 bg-black/40"
      >
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  PureTickets.pro
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium Ticketmaster accounts for seamless ticket purchasing
                experiences.
              </p>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <a
                  href="https://discord.gg/qY8nj7wN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#5865F2] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 127.14 96.36"
                  >
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                  </svg>
                  Join our Discord
                </a>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Live chat available 24/7
                </div>
              </div>
            </div>

            {/* We Accept */}
            <div>
              <h4 className="text-white font-semibold mb-4">We Accept</h4>
              <div className="flex gap-2 mb-4 flex-wrap">
                {/* Credit Card */}
                <div
                  className="w-10 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center"
                  title="Credit Card"
                >
                  <svg
                    className="w-5 h-5 text-violet-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 10v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6h20zm0-2H2V6a2 2 0 012-2h16a2 2 0 012 2v2zM4 14a1 1 0 011-1h4a1 1 0 010 2H5a1 1 0 01-1-1z" />
                  </svg>
                </div>
                {/* Bitcoin */}
                <div
                  className="w-10 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden"
                  title="Bitcoin"
                >
                  <img
                    src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
                    alt="Bitcoin"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                {/* Ethereum */}
                <div
                  className="w-10 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden"
                  title="Ethereum"
                >
                  <img
                    src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                    alt="Ethereum"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                {/* Litecoin */}
                <div
                  className="w-10 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden"
                  title="Litecoin"
                >
                  <img
                    src="https://cryptologos.cc/logos/litecoin-ltc-logo.png"
                    alt="Litecoin"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                {/* USDT */}
                <div
                  className="w-10 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden"
                  title="USDT"
                >
                  <img
                    src="https://cryptologos.cc/logos/tether-usdt-logo.png"
                    alt="USDT"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                All transactions are secure and encrypted
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 NejoTickets.pro. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">
              This site is not affiliated with or endorsed by Ticketmaster.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
