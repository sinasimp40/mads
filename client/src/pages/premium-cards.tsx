import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, Zap, Crown, Users, ArrowRight, ShieldCheck, Flame, Plus, Settings, X, Image as ImageIcon, Link as LinkIcon, Trash2 } from "lucide-react";
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
const PremiumCard = ({ product, onDelete }: { product: ProductCardProps, onDelete?: (id: string) => void }) => {
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
        <Button 
          variant="destructive" 
          size="icon" 
          className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product.id);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
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

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 z-20">
          <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/20 text-white font-bold text-sm shadow-lg">
            {product.price.startsWith('$') ? product.price : `$${product.price}`}
            <span className="text-xs text-muted-foreground font-normal ml-1">/mo</span>
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

const HeroSection = () => (
  <div className="relative py-24 px-6 overflow-hidden">
    {/* Background Effects */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
    
    <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
      <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
        <Flame className="w-4 h-4 mr-2" /> Premier Digital Marketplace
      </Badge>
      
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
        Unlock <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Premium</span> Access
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        Discover exclusive communities, powerful software, and elite courses. 
        Join the top 1% of digital entrepreneurs today.
      </p>

      <div className="flex items-center justify-center gap-4 pt-4">
        <Button size="lg" className="bg-primary hover:bg-orange-600 text-white font-bold px-8 h-12 rounded-full shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
          Start Exploring
        </Button>
        <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 h-12 rounded-full">
          Sell Your Product
        </Button>
      </div>
    </div>
  </div>
);

// Initial Mock Data
const INITIAL_PRODUCTS: ProductCardProps[] = [
  {
    id: "1",
    title: "Phantom Checker",
    description: "The ultimate ticket monitoring solution for professional resellers. Never miss a drop again.",
    price: "600.00",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
    tags: ["Reselling", "Tickets", "Bot"],
    rating: 5.0,
    reviews: 500,
    featured: true,
    type: "software",
    joinLink: "#"
  },
  {
    id: "2",
    title: "Ticket Broker University",
    description: "Learn the secrets of ticket brokering from industry veterans. Comprehensive guides and daily support.",
    price: "149.97",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070",
    tags: ["Education", "Community", "Finance"],
    rating: 4.97,
    reviews: 134,
    type: "course",
    joinLink: "#"
  }
];

export default function PremiumCardsPage() {
  const [products, setProducts] = useState<ProductCardProps[]>(() => {
    const saved = localStorage.getItem("premium_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("admin_auth") === "true");

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAdmin(false);
  };
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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
  }, [products]);

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.description || !newProduct.price) return;
    
    const product: ProductCardProps = {
      id: Math.random().toString(36).substr(2, 9),
      title: newProduct.title as string,
      description: newProduct.description as string,
      price: newProduct.price as string,
      image: newProduct.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
      tags: newProduct.tags || ["General"],
      rating: newProduct.rating || 5,
      reviews: newProduct.reviews || 0,
      featured: newProduct.featured || false,
      type: newProduct.type as any,
      joinLink: newProduct.joinLink || "#"
    };

    setProducts([product, ...products]);
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

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || 
                           (activeCategory === "Paid Groups" && p.type === "community") ||
                           (activeCategory === "Software" && p.type === "software") ||
                           (activeCategory === "Courses" && p.type === "course") ||
                           p.tags.some(t => t.toLowerCase() === activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

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
            <a href="#" className="hover:text-white transition-colors">Marketplace</a>
            {isAdmin && (
              <button onClick={handleLogout} className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Logout Admin
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                {isAdmin && (
                  <Button size="sm" className="bg-primary hover:bg-orange-600 text-white font-bold">
                    <Plus className="w-4 h-4 mr-1" /> Add Product
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Add New Premium Product</DialogTitle>
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
                      <Select 
                        onValueChange={(v: any) => setNewProduct({...newProduct, type: v})}
                        defaultValue={newProduct.type}
                      >
                        <SelectTrigger className="bg-black/50 border-white/10">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10 text-white">
                          <SelectItem value="community">Community</SelectItem>
                          <SelectItem value="software">Software</SelectItem>
                          <SelectItem value="course">Course</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <Button variant="ghost" className="hover:bg-white/5">Cancel</Button>
                  </DialogTrigger>
                  <Button onClick={handleAddProduct} className="bg-primary hover:bg-orange-600 text-white px-8">Create Product</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button size="sm" className="bg-white text-black hover:bg-gray-200 font-bold">Get Started</Button>
          </div>
        </div>
      </nav>

      <HeroSection />

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-24">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Input 
              placeholder="Search products, communities, software..." 
              className="bg-white/5 border-white/10 h-12 pl-12 rounded-xl focus:ring-primary/50 focus:border-primary/50"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
               {/* Search icon placeholder */}
               <Users className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {["All", "Paid Groups", "Software", "Courses", "Newsletters", "Trading", "Reselling"].map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveCategory(filter)}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap border h-12",
                  activeCategory === filter 
                    ? "bg-white text-black border-white" 
                    : "bg-white/5 text-muted-foreground border-white/5 hover:text-white hover:bg-white/10"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {activeCategory === "All" ? "Featured Products" : activeCategory}
            </h2>
            <p className="text-muted-foreground">Showing {filteredProducts.length} results</p>
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product) => (
              <PremiumCard 
                key={product.id} 
                product={product} 
                onDelete={isAdmin ? handleDelete : undefined}
              />
            ))}
            {filteredProducts.length === 0 && (
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
