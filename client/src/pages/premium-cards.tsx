import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, Zap, Crown, Users, ArrowRight, ShieldCheck, Flame, Plus, Settings, X, Image as ImageIcon, Link as LinkIcon, Trash2, Lock, Clock, Headphones, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
const PremiumCard = ({ product, onDelete, onEdit }: { 
  product: ProductCardProps, 
  onDelete?: (id: string) => void,
  onEdit?: (product: ProductCardProps) => void 
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
            <Badge variant="secondary" className="bg-black/50 backdrop-blur-md border border-white/10 text-white">
              <Zap className="w-3 h-3 mr-1" /> Software
            </Badge>
          )}
        </div>

          <div className="absolute bottom-3 right-3 z-20">
            <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/20 text-white font-bold text-sm shadow-lg">
              {product.price === "Free" ? "Free" : (product.price.startsWith('$') ? product.price : `$${product.price}`)}
              {product.price !== "Free" && <span className="text-xs text-muted-foreground font-normal ml-1">/mo</span>}
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
                  className={cn("w-3.5 h-3.5", i < Math.floor(product.rating) ? "fill-primary" : "text-muted opacity-30")} 
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
          {isCommunity && <span className="text-xs text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online</span>}
        </div>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.map((tag, i) => (
            <span key={i} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 text-white/70 border border-white/5">
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
          <a href={product.joinLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
            Join Now
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </a>
        </Button>
      </div>
    </motion.div>
  );
};

// Initial Mock Data (Empty for users to populate)
const INITIAL_PRODUCTS: ProductCardProps[] = [];

export default function PremiumCardsPage() {
  const [products, setProducts] = useState<ProductCardProps[]>(() => []);

  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("admin_auth") === "true");

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAdmin(false);
  };
  const [editingProduct, setEditingProduct] = useState<ProductCardProps | null>(null);

  // Form State
  const [newProduct, setNewProduct] = useState<Partial<ProductCardProps>>({
    type: "community",
    rating: 5,
    reviews: 0,
    tags: [],
    featured: false,
    joinLink: "https://",
    price: ""
  });

  useEffect(() => {
    localStorage.setItem("premium_products", JSON.stringify(products));
    if (isAdmin) localStorage.setItem("admin_auth", "true");
  }, [products, isAdmin]);

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.description) return;
    
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...newProduct } as ProductCardProps : p));
      setEditingProduct(null);
    } else {
      const product: ProductCardProps = {
        id: Math.random().toString(36).substr(2, 9),
        title: newProduct.title as string,
        description: newProduct.description as string,
        price: newProduct.price || "Free",
        image: newProduct.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
        tags: newProduct.tags || ["General"],
        rating: newProduct.rating || 5,
        reviews: newProduct.reviews || 0,
        featured: newProduct.featured || false,
        type: newProduct.type as any,
        joinLink: newProduct.joinLink || "#"
      };
      setProducts([product, ...products]);
    }

    setNewProduct({
      type: "community",
      rating: 5,
      reviews: 0,
      tags: [],
      featured: false,
      joinLink: "https://",
      price: ""
    });
  };

  const handleEdit = (product: ProductCardProps) => {
    setNewProduct(product);
    setEditingProduct(product);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="font-bold text-xl tracking-tight">Whop<span className="text-primary">Clone</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {isAdmin && (
              <button onClick={handleLogout} className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Logout Admin
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Dialog open={!!editingProduct || undefined} onOpenChange={(open) => {
              if (!open) {
                setEditingProduct(null);
                setNewProduct({
                  type: "community",
                  rating: 5,
                  reviews: 0,
                  tags: [],
                  featured: false,
                  joinLink: "https://",
                  price: ""
                });
              }
            }}>
              <DialogTrigger asChild>
                {isAdmin && (
                  <Button size="sm" className="bg-primary hover:bg-orange-600 text-white font-bold">
                    <Plus className="w-4 h-4 mr-1" /> Add Product
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    {editingProduct ? "Edit Product" : "Add New Premium Product"}
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
                        onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (Monthly)</Label>
                      <Input 
                        placeholder="e.g. 99.00" 
                        className="bg-black/50 border-white/10"
                        value={newProduct.price || ""}
                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category / Type</Label>
                      <Input 
                        placeholder="e.g. Reselling, Software, Course" 
                        className="bg-black/50 border-white/10"
                        value={newProduct.type === "community" ? (newProduct.tags?.[0] || "") : newProduct.type === "software" ? "Software" : newProduct.type === "course" ? "Courses" : (newProduct.tags?.[0] || "")}
                        onChange={e => {
                          const val = e.target.value;
                          setNewProduct({
                            ...newProduct, 
                            type: "community", 
                            tags: [val]
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Join Link</Label>
                      <Input 
                        placeholder="https://..." 
                        className="bg-black/50 border-white/10"
                        value={newProduct.joinLink || ""}
                        onChange={e => setNewProduct({...newProduct, joinLink: e.target.value})}
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
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input 
                        placeholder="https://images.unsplash.com/..." 
                        className="bg-black/50 border-white/10"
                        value={newProduct.image || ""}
                        onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 accent-primary"
                          checked={newProduct.featured || false}
                          onChange={e => setNewProduct({...newProduct, featured: e.target.checked})}
                        />
                        <span className="text-sm">Featured</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="hover:bg-white/5" onClick={() => setEditingProduct(null)}>Cancel</Button>
                  </DialogTrigger>
                  <Button onClick={handleAddProduct} className="bg-primary hover:bg-orange-600 text-white px-8">
                    {editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-violet-500/20 rounded-full blur-[60px]" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-500/15 rounded-full blur-[80px]" />
        
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
              <span className="text-sm text-white/80">Trusted by thousands worldwide</span>
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
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">Premium </span>
              <span className="bg-gradient-to-r from-primary via-violet-400 to-primary bg-clip-text text-transparent">Ticketmaster</span>
              <br />
              <span className="bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent">Accounts</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Elevate your ticket purchasing experience with our aged Ticketmaster accounts. 
              Secure, reliable, and ready for instant use.
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
            >
              Explore Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white px-8 py-6 text-lg font-semibold"
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
                <h3 className="text-lg font-semibold text-white mb-2">Secure Transactions</h3>
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
                <h3 className="text-lg font-semibold text-white mb-2">Instant Delivery</h3>
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
                <h3 className="text-lg font-semibold text-white mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our customer service team is always available to assist you
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 pb-24">
        {/* Grid */}
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
                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Newsletter Section */}
        <div className="mt-24 rounded-3xl bg-gradient-to-br from-card to-background border border-white/5 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[80px]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-3xl font-bold text-white mb-4">Join 200,000+ Entrepreneurs</h3>
              <p className="text-muted-foreground mb-6">
                Get the latest drops, strategies, and tools delivered straight to your inbox. 
                Don't miss the next big opportunity.
              </p>
              <div className="flex gap-2 max-w-md">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
                <Button className="bg-primary hover:bg-orange-600 text-white px-6">Subscribe</Button>
              </div>
            </div>
            <div className="flex-shrink-0">
               <div className="flex -space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-card bg-gray-800 flex items-center justify-center overflow-hidden">
                       <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-2 border-card bg-primary flex items-center justify-center text-white font-bold text-xs">
                    +2k
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
