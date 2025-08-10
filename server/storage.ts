import { 
  users, 
  drugs, 
  sales, 
  saleItems, 
  purchases, 
  purchaseItems, 
  suppliers, 
  requests,
  type User, 
  type InsertUser,
  type Drug,
  type InsertDrug,
  type Sale,
  type InsertSale,
  type SaleItem,
  type InsertSaleItem,
  type Purchase,
  type InsertPurchase,
  type PurchaseItem,
  type InsertPurchaseItem,
  type Supplier,
  type InsertSupplier,
  type Request,
  type InsertRequest
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Drug methods
  getDrugs(): Promise<Drug[]>;
  getDrug(id: number): Promise<Drug | undefined>;
  createDrug(drug: InsertDrug): Promise<Drug>;
  updateDrug(id: number, drug: Partial<InsertDrug>): Promise<Drug>;
  deleteDrug(id: number): Promise<boolean>;
  searchDrugs(query: string): Promise<Drug[]>;
  
  // Sale methods
  getSales(): Promise<Sale[]>;
  getSale(id: number): Promise<Sale | undefined>;
  createSale(sale: InsertSale): Promise<Sale>;
  getSaleItems(saleId: number): Promise<SaleItem[]>;
  createSaleItem(saleItem: InsertSaleItem): Promise<SaleItem>;
  
  // Purchase methods
  getPurchases(): Promise<Purchase[]>;
  getPurchase(id: number): Promise<Purchase | undefined>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  updatePurchase(id: number, purchase: Partial<InsertPurchase>): Promise<Purchase>;
  getPurchaseItems(purchaseId: number): Promise<PurchaseItem[]>;
  createPurchaseItem(purchaseItem: InsertPurchaseItem): Promise<PurchaseItem>;
  
  // Supplier methods
  getSuppliers(): Promise<Supplier[]>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  
  // Request methods
  getRequests(): Promise<Request[]>;
  createRequest(request: InsertRequest): Promise<Request>;
  updateRequest(id: number, request: Partial<InsertRequest>): Promise<Request>;
  
  // Dashboard methods
  getDashboardStats(): Promise<{
    totalSales: number;
    totalRevenue: number;
    lowStockCount: number;
    totalDrugs: number;
    pendingRequests: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Drug methods
  async getDrugs(): Promise<Drug[]> {
    return await db.select().from(drugs).orderBy(drugs.name);
  }

  async getDrug(id: number): Promise<Drug | undefined> {
    const [drug] = await db.select().from(drugs).where(eq(drugs.id, id));
    return drug || undefined;
  }

  async createDrug(insertDrug: InsertDrug): Promise<Drug> {
    const [drug] = await db
      .insert(drugs)
      .values(insertDrug)
      .returning();
    return drug;
  }

  async updateDrug(id: number, updateDrug: Partial<InsertDrug>): Promise<Drug> {
    const [drug] = await db
      .update(drugs)
      .set({ ...updateDrug, updatedAt: new Date() })
      .where(eq(drugs.id, id))
      .returning();
    return drug;
  }

  async deleteDrug(id: number): Promise<boolean> {
    const result = await db.delete(drugs).where(eq(drugs.id, id));
    return (result.rowCount || 0) > 0;
  }

  async searchDrugs(query: string): Promise<Drug[]> {
    return await db
      .select()
      .from(drugs)
      .where(sql`${drugs.name} ILIKE ${`%${query}%`} OR ${drugs.genericName} ILIKE ${`%${query}%`}`)
      .orderBy(drugs.name);
  }

  // Sale methods
  async getSales(): Promise<Sale[]> {
    return await db.select().from(sales).orderBy(desc(sales.createdAt));
  }

  async getSale(id: number): Promise<Sale | undefined> {
    const [sale] = await db.select().from(sales).where(eq(sales.id, id));
    return sale || undefined;
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const [sale] = await db
      .insert(sales)
      .values(insertSale)
      .returning();
    return sale;
  }

  async getSaleItems(saleId: number): Promise<SaleItem[]> {
    return await db.select().from(saleItems).where(eq(saleItems.saleId, saleId));
  }

  async createSaleItem(insertSaleItem: InsertSaleItem): Promise<SaleItem> {
    const [saleItem] = await db
      .insert(saleItems)
      .values(insertSaleItem)
      .returning();
    return saleItem;
  }

  // Purchase methods
  async getPurchases(): Promise<Purchase[]> {
    return await db.select().from(purchases).orderBy(desc(purchases.orderDate));
  }

  async getPurchase(id: number): Promise<Purchase | undefined> {
    const [purchase] = await db.select().from(purchases).where(eq(purchases.id, id));
    return purchase || undefined;
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db
      .insert(purchases)
      .values(insertPurchase)
      .returning();
    return purchase;
  }

  async updatePurchase(id: number, updatePurchase: Partial<InsertPurchase>): Promise<Purchase> {
    const [purchase] = await db
      .update(purchases)
      .set(updatePurchase)
      .where(eq(purchases.id, id))
      .returning();
    return purchase;
  }

  async getPurchaseItems(purchaseId: number): Promise<PurchaseItem[]> {
    return await db.select().from(purchaseItems).where(eq(purchaseItems.purchaseId, purchaseId));
  }

  async createPurchaseItem(insertPurchaseItem: InsertPurchaseItem): Promise<PurchaseItem> {
    const [purchaseItem] = await db
      .insert(purchaseItems)
      .values(insertPurchaseItem)
      .returning();
    return purchaseItem;
  }

  // Supplier methods
  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).orderBy(suppliers.name);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const [supplier] = await db
      .insert(suppliers)
      .values(insertSupplier)
      .returning();
    return supplier;
  }

  // Request methods
  async getRequests(): Promise<Request[]> {
    return await db.select().from(requests).orderBy(desc(requests.createdAt));
  }

  async createRequest(insertRequest: InsertRequest): Promise<Request> {
    const [request] = await db
      .insert(requests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async updateRequest(id: number, updateRequest: Partial<InsertRequest>): Promise<Request> {
    const [request] = await db
      .update(requests)
      .set({ ...updateRequest, updatedAt: new Date() })
      .where(eq(requests.id, id))
      .returning();
    return request;
  }

  // Dashboard methods
  async getDashboardStats(): Promise<{
    totalSales: number;
    totalRevenue: number;
    lowStockCount: number;
    totalDrugs: number;
    pendingRequests: number;
  }> {
    const [salesCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(sales);

    const [revenueSum] = await db
      .select({ sum: sql<number>`coalesce(sum(${sales.totalAmount}), 0)` })
      .from(sales);

    const [lowStockCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(drugs)
      .where(sql`${drugs.quantity} <= ${drugs.minimumStock}`);

    const [totalDrugs] = await db
      .select({ count: sql<number>`count(*)` })
      .from(drugs);

    const [pendingRequests] = await db
      .select({ count: sql<number>`count(*)` })
      .from(requests)
      .where(eq(requests.status, 'pending'));

    return {
      totalSales: salesCount.count || 0,
      totalRevenue: Number(revenueSum.sum) || 0,
      lowStockCount: lowStockCount.count || 0,
      totalDrugs: totalDrugs.count || 0,
      pendingRequests: pendingRequests.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
