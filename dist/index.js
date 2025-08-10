var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  drugs: () => drugs,
  drugsRelations: () => drugsRelations,
  insertDrugSchema: () => insertDrugSchema,
  insertPurchaseItemSchema: () => insertPurchaseItemSchema,
  insertPurchaseSchema: () => insertPurchaseSchema,
  insertRequestSchema: () => insertRequestSchema,
  insertSaleItemSchema: () => insertSaleItemSchema,
  insertSaleSchema: () => insertSaleSchema,
  insertSupplierSchema: () => insertSupplierSchema,
  insertUserSchema: () => insertUserSchema,
  purchaseItems: () => purchaseItems,
  purchaseItemsRelations: () => purchaseItemsRelations,
  purchases: () => purchases,
  purchasesRelations: () => purchasesRelations,
  requests: () => requests,
  requestsRelations: () => requestsRelations,
  saleItems: () => saleItems,
  saleItemsRelations: () => saleItemsRelations,
  sales: () => sales,
  salesRelations: () => salesRelations,
  suppliers: () => suppliers,
  suppliersRelations: () => suppliersRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["admin", "pharmacist", "staff"] }).notNull(),
  initials: text("initials").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var drugs = pgTable("drugs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  genericName: text("generic_name"),
  dosage: text("dosage").notNull(),
  form: text("form").notNull(),
  // tablet, capsule, liquid, etc.
  manufacturer: text("manufacturer").notNull(),
  batchNumber: text("batch_number").notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  sellingPrice: decimal("selling_price", { precision: 10, scale: 2 }).notNull(),
  minimumStock: integer("minimum_stock").notNull().default(10),
  category: text("category").notNull(),
  description: text("description"),
  barcode: text("barcode").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method", { enum: ["cash", "card", "insurance"] }).notNull(),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var saleItems = pgTable("sale_items", {
  id: serial("id").primaryKey(),
  saleId: integer("sale_id").references(() => sales.id).notNull(),
  drugId: integer("drug_id").references(() => drugs.id).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull()
});
var purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status", { enum: ["pending", "approved", "received", "cancelled"] }).notNull().default("pending"),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  receivedDate: timestamp("received_date"),
  notes: text("notes")
});
var purchaseItems = pgTable("purchase_items", {
  id: serial("id").primaryKey(),
  purchaseId: integer("purchase_id").references(() => purchases.id).notNull(),
  drugId: integer("drug_id").references(() => drugs.id).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull()
});
var suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type", { enum: ["stock", "prescription", "return", "other"] }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).notNull().default("medium"),
  status: text("status", { enum: ["pending", "approved", "rejected", "completed"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var usersRelations = relations(users, ({ many }) => ({
  sales: many(sales),
  purchases: many(purchases),
  requests: many(requests)
}));
var drugsRelations = relations(drugs, ({ many }) => ({
  saleItems: many(saleItems),
  purchaseItems: many(purchaseItems)
}));
var salesRelations = relations(sales, ({ one, many }) => ({
  user: one(users, { fields: [sales.userId], references: [users.id] }),
  saleItems: many(saleItems)
}));
var saleItemsRelations = relations(saleItems, ({ one }) => ({
  sale: one(sales, { fields: [saleItems.saleId], references: [sales.id] }),
  drug: one(drugs, { fields: [saleItems.drugId], references: [drugs.id] })
}));
var purchasesRelations = relations(purchases, ({ one, many }) => ({
  supplier: one(suppliers, { fields: [purchases.supplierId], references: [suppliers.id] }),
  user: one(users, { fields: [purchases.userId], references: [users.id] }),
  purchaseItems: many(purchaseItems)
}));
var purchaseItemsRelations = relations(purchaseItems, ({ one }) => ({
  purchase: one(purchases, { fields: [purchaseItems.purchaseId], references: [purchases.id] }),
  drug: one(drugs, { fields: [purchaseItems.drugId], references: [drugs.id] })
}));
var suppliersRelations = relations(suppliers, ({ many }) => ({
  purchases: many(purchases)
}));
var requestsRelations = relations(requests, ({ one }) => ({
  user: one(users, { fields: [requests.userId], references: [users.id] })
}));
var insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
var insertDrugSchema = createInsertSchema(drugs).omit({ id: true, createdAt: true, updatedAt: true });
var insertSaleSchema = createInsertSchema(sales).omit({ id: true, createdAt: true });
var insertSaleItemSchema = createInsertSchema(saleItems).omit({ id: true });
var insertPurchaseSchema = createInsertSchema(purchases).omit({ id: true, orderDate: true });
var insertPurchaseItemSchema = createInsertSchema(purchaseItems).omit({ id: true });
var insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true, createdAt: true });
var insertRequestSchema = createInsertSchema(requests).omit({ id: true, createdAt: true, updatedAt: true });

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, sql } from "drizzle-orm";
var DatabaseStorage = class {
  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Drug methods
  async getDrugs() {
    return await db.select().from(drugs).orderBy(drugs.name);
  }
  async getDrug(id) {
    const [drug] = await db.select().from(drugs).where(eq(drugs.id, id));
    return drug || void 0;
  }
  async createDrug(insertDrug) {
    const [drug] = await db.insert(drugs).values(insertDrug).returning();
    return drug;
  }
  async updateDrug(id, updateDrug) {
    const [drug] = await db.update(drugs).set({ ...updateDrug, updatedAt: /* @__PURE__ */ new Date() }).where(eq(drugs.id, id)).returning();
    return drug;
  }
  async deleteDrug(id) {
    const result = await db.delete(drugs).where(eq(drugs.id, id));
    return (result.rowCount || 0) > 0;
  }
  async searchDrugs(query) {
    return await db.select().from(drugs).where(sql`${drugs.name} ILIKE ${`%${query}%`} OR ${drugs.genericName} ILIKE ${`%${query}%`}`).orderBy(drugs.name);
  }
  // Sale methods
  async getSales() {
    return await db.select().from(sales).orderBy(desc(sales.createdAt));
  }
  async getSale(id) {
    const [sale] = await db.select().from(sales).where(eq(sales.id, id));
    return sale || void 0;
  }
  async createSale(insertSale) {
    const [sale] = await db.insert(sales).values(insertSale).returning();
    return sale;
  }
  async getSaleItems(saleId) {
    return await db.select().from(saleItems).where(eq(saleItems.saleId, saleId));
  }
  async createSaleItem(insertSaleItem) {
    const [saleItem] = await db.insert(saleItems).values(insertSaleItem).returning();
    return saleItem;
  }
  // Purchase methods
  async getPurchases() {
    return await db.select().from(purchases).orderBy(desc(purchases.orderDate));
  }
  async getPurchase(id) {
    const [purchase] = await db.select().from(purchases).where(eq(purchases.id, id));
    return purchase || void 0;
  }
  async createPurchase(insertPurchase) {
    const [purchase] = await db.insert(purchases).values(insertPurchase).returning();
    return purchase;
  }
  async updatePurchase(id, updatePurchase) {
    const [purchase] = await db.update(purchases).set(updatePurchase).where(eq(purchases.id, id)).returning();
    return purchase;
  }
  async getPurchaseItems(purchaseId) {
    return await db.select().from(purchaseItems).where(eq(purchaseItems.purchaseId, purchaseId));
  }
  async createPurchaseItem(insertPurchaseItem) {
    const [purchaseItem] = await db.insert(purchaseItems).values(insertPurchaseItem).returning();
    return purchaseItem;
  }
  // Supplier methods
  async getSuppliers() {
    return await db.select().from(suppliers).orderBy(suppliers.name);
  }
  async createSupplier(insertSupplier) {
    const [supplier] = await db.insert(suppliers).values(insertSupplier).returning();
    return supplier;
  }
  // Request methods
  async getRequests() {
    return await db.select().from(requests).orderBy(desc(requests.createdAt));
  }
  async createRequest(insertRequest) {
    const [request] = await db.insert(requests).values(insertRequest).returning();
    return request;
  }
  async updateRequest(id, updateRequest) {
    const [request] = await db.update(requests).set({ ...updateRequest, updatedAt: /* @__PURE__ */ new Date() }).where(eq(requests.id, id)).returning();
    return request;
  }
  // Dashboard methods
  async getDashboardStats() {
    const [salesCount] = await db.select({ count: sql`count(*)` }).from(sales);
    const [revenueSum] = await db.select({ sum: sql`coalesce(sum(${sales.totalAmount}), 0)` }).from(sales);
    const [lowStockCount] = await db.select({ count: sql`count(*)` }).from(drugs).where(sql`${drugs.quantity} <= ${drugs.minimumStock}`);
    const [totalDrugs] = await db.select({ count: sql`count(*)` }).from(drugs);
    const [pendingRequests] = await db.select({ count: sql`count(*)` }).from(requests).where(eq(requests.status, "pending"));
    return {
      totalSales: salesCount.count || 0,
      totalRevenue: Number(revenueSum.sum) || 0,
      lowStockCount: lowStockCount.count || 0,
      totalDrugs: totalDrugs.count || 0,
      pendingRequests: pendingRequests.count || 0
    };
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
import bcrypt from "bcryptjs";
async function registerRoutes(app2) {
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json({
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          initials: user.initials
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      res.status(201).json({
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          initials: user.initials
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/drugs", async (req, res) => {
    try {
      const { search } = req.query;
      let drugs2;
      if (search && typeof search === "string") {
        drugs2 = await storage.searchDrugs(search);
      } else {
        drugs2 = await storage.getDrugs();
      }
      res.json(drugs2);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/drugs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const drug = await storage.getDrug(id);
      if (!drug) {
        return res.status(404).json({ message: "Drug not found" });
      }
      res.json(drug);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/drugs", async (req, res) => {
    try {
      const drugData = insertDrugSchema.parse(req.body);
      const drug = await storage.createDrug(drugData);
      res.status(201).json(drug);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.put("/api/drugs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const drugData = insertDrugSchema.partial().parse(req.body);
      const drug = await storage.updateDrug(id, drugData);
      res.json(drug);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/drugs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDrug(id);
      if (!success) {
        return res.status(404).json({ message: "Drug not found" });
      }
      res.json({ message: "Drug deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/sales", async (req, res) => {
    try {
      const sales2 = await storage.getSales();
      res.json(sales2);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/sales", async (req, res) => {
    try {
      const { sale, items } = req.body;
      const saleData = insertSaleSchema.parse(sale);
      const createdSale = await storage.createSale(saleData);
      const saleItems2 = await Promise.all(
        items.map((item) => {
          const itemData = insertSaleItemSchema.parse({
            ...item,
            saleId: createdSale.id
          });
          return storage.createSaleItem(itemData);
        })
      );
      res.status(201).json({ sale: createdSale, items: saleItems2 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/purchases", async (req, res) => {
    try {
      const purchases2 = await storage.getPurchases();
      res.json(purchases2);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/purchases", async (req, res) => {
    try {
      const purchaseData = insertPurchaseSchema.parse(req.body);
      const purchase = await storage.createPurchase(purchaseData);
      res.status(201).json(purchase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.put("/api/purchases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const purchaseData = insertPurchaseSchema.partial().parse(req.body);
      const purchase = await storage.updatePurchase(id, purchaseData);
      res.json(purchase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers2 = await storage.getSuppliers();
      res.json(suppliers2);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/suppliers", async (req, res) => {
    try {
      const supplierData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(supplierData);
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/requests", async (req, res) => {
    try {
      const requests2 = await storage.getRequests();
      res.json(requests2);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/requests", async (req, res) => {
    try {
      const requestData = insertRequestSchema.parse(req.body);
      const request = await storage.createRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.put("/api/requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const requestData = insertRequestSchema.partial().parse(req.body);
      const request = await storage.updateRequest(id, requestData);
      res.json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
