import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, updateProductSchema } from "@shared/schema";
import { broadcastUpdate } from "./index";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Admin Routes
  app.post("/api/admin/login", async (req, res) => {
    const { password } = req.body;
    // For simplicity, we assume username is 'admin'
    const user = await storage.getUserByUsername("admin");
    
    if (!user) {
      // Create admin if not exists (first run)
      if (password === "admin123") {
        await storage.createUser({ username: "admin", password });
        return res.json({ success: true });
      }
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.password === password) {
      return res.json({ success: true });
    }
    
    res.status(401).json({ error: "Invalid credentials" });
  });

  app.post("/api/admin/reset-password", async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: "Password required" });
    }

    let user = await storage.getUserByUsername("admin");
    if (!user) {
      await storage.createUser({ username: "admin", password: newPassword });
    } else {
      await storage.updateUserPassword("admin", newPassword);
    }

    res.json({ success: true });
  });
  
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const parsed = insertProductSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid product data", details: parsed.error });
      }
      const product = await storage.createProduct(parsed.data);
      
      // Broadcast to all clients instantly
      broadcastUpdate("product_added", product);
      
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const parsed = updateProductSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid product data", details: parsed.error });
      }
      const product = await storage.updateProduct(req.params.id, parsed.data);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      // Broadcast to all clients instantly
      broadcastUpdate("product_updated", product);
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      // Broadcast to all clients instantly
      broadcastUpdate("product_deleted", { id: req.params.id });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  return httpServer;
}
