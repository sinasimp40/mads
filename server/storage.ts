import { type User, type InsertUser, type Product, type InsertProduct, type UpdateProduct } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: UpdateProduct): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    
    const defaultProducts: Product[] = [
      {
        id: "tm-aged-1",
        title: "Aged Ticketmaster Account - 2+ Years",
        description: "Premium aged Ticketmaster account with 2+ years of history. Clean record, verified email, ready for immediate use on any event.",
        price: "$49.99",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
        tags: ["Aged", "Verified", "Premium"],
        rating: 5,
        reviews: 124,
        featured: true,
        type: "software",
        joinLink: "#",
        createdAt: new Date(),
      },
      {
        id: "tm-aged-2",
        title: "Aged Ticketmaster Account - 5+ Years",
        description: "Ultra-premium account with 5+ years of purchasing history. Highest priority queue access and maximum reliability.",
        price: "$89.99",
        image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
        tags: ["Ultra Aged", "VIP", "Top Tier"],
        rating: 5,
        reviews: 89,
        featured: true,
        type: "software",
        joinLink: "#",
        createdAt: new Date(),
      },
      {
        id: "tm-fresh-1",
        title: "Fresh Ticketmaster Account",
        description: "Brand new verified Ticketmaster account. Email verified, phone verified, ready to use instantly.",
        price: "$19.99",
        image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
        tags: ["Fresh", "Verified", "Instant"],
        rating: 4,
        reviews: 256,
        featured: false,
        type: "software",
        joinLink: "#",
        createdAt: new Date(),
      },
      {
        id: "tm-bulk-1",
        title: "Bulk Account Pack (10x)",
        description: "Pack of 10 fresh verified Ticketmaster accounts. Perfect for resellers and high-volume buyers.",
        price: "$149.99",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        tags: ["Bulk", "Value Pack", "Reseller"],
        rating: 5,
        reviews: 67,
        featured: false,
        type: "software",
        joinLink: "#",
        createdAt: new Date(),
      }
    ];
    
    defaultProducts.forEach(p => this.products.set(p.id, p));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      id,
      title: insertProduct.title,
      description: insertProduct.description,
      price: insertProduct.price,
      image: insertProduct.image,
      tags: insertProduct.tags ?? [],
      rating: insertProduct.rating ?? 5,
      reviews: insertProduct.reviews ?? 0,
      featured: insertProduct.featured ?? false,
      type: insertProduct.type ?? "software",
      joinLink: insertProduct.joinLink ?? "#",
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: UpdateProduct): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated: Product = { ...existing, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}

export const storage = new MemStorage();
