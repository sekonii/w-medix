import { db } from "./db";
import { users, drugs, suppliers } from "@shared/schema";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Create demo users
    const hashedPassword1 = await bcrypt.hash("admin123", 10);
    const hashedPassword2 = await bcrypt.hash("pharm123", 10);
    const hashedPassword3 = await bcrypt.hash("staff123", 10);

    const insertedUsers = await db.insert(users).values([
      {
        username: "admin",
        password: hashedPassword1,
        name: "Dr. John Admin",
        role: "admin",
        initials: "JA"
      },
      {
        username: "pharmacist",
        password: hashedPassword2,
        name: "Sarah PharmD",
        role: "pharmacist",
        initials: "SP"
      },
      {
        username: "staff",
        password: hashedPassword3,
        name: "Mike Clinical",
        role: "staff",
        initials: "MC"
      }
    ]).onConflictDoNothing().returning();

    console.log(`Created ${insertedUsers.length} users`);

    // Create demo suppliers
    const insertedSuppliers = await db.insert(suppliers).values([
      {
        name: "PharmaCorp International",
        contactPerson: "Jennifer Wilson",
        email: "orders@pharmacorp.com",
        phone: "+1-555-0123",
        address: "123 Medical Plaza, Healthcare City, HC 12345"
      },
      {
        name: "MediSupply Solutions",
        contactPerson: "Robert Chen",
        email: "sales@medisupply.com",
        phone: "+1-555-0124", 
        address: "456 Pharmacy Ave, Drug District, DD 67890"
      },
      {
        name: "HealthDistributors Ltd",
        contactPerson: "Maria Rodriguez",
        email: "procurement@healthdist.com",
        phone: "+1-555-0125",
        address: "789 Supply Chain Blvd, Medicine Town, MT 11111"
      }
    ]).onConflictDoNothing().returning();

    console.log(`Created ${insertedSuppliers.length} suppliers`);

    // Create demo drugs
    const insertedDrugs = await db.insert(drugs).values([
      {
        name: "Paracetamol",
        genericName: "Acetaminophen",
        dosage: "500mg",
        form: "Tablet",
        manufacturer: "PharmaCorp International",
        batchNumber: "PC2024001",
        expiryDate: new Date("2025-12-31"),
        quantity: 500,
        unitPrice: "0.25",
        sellingPrice: "0.50",
        minimumStock: 100,
        category: "Pain Relief",
        description: "Over-the-counter pain reliever and fever reducer",
        barcode: "1234567890123"
      },
      {
        name: "Amoxicillin",
        genericName: "Amoxicillin",
        dosage: "250mg",
        form: "Capsule",
        manufacturer: "MediSupply Solutions",
        batchNumber: "MS2024002",
        expiryDate: new Date("2025-06-30"),
        quantity: 200,
        unitPrice: "1.50",
        sellingPrice: "3.00",
        minimumStock: 50,
        category: "Antibiotic",
        description: "Penicillin-type antibiotic for bacterial infections",
        barcode: "1234567890124"
      },
      {
        name: "Ibuprofen",
        genericName: "Ibuprofen",
        dosage: "400mg",
        form: "Tablet",
        manufacturer: "HealthDistributors Ltd",
        batchNumber: "HD2024003",
        expiryDate: new Date("2025-11-15"),
        quantity: 300,
        unitPrice: "0.30",
        sellingPrice: "0.75",
        minimumStock: 75,
        category: "Pain Relief",
        description: "Nonsteroidal anti-inflammatory drug (NSAID)",
        barcode: "1234567890125"
      },
      {
        name: "Aspirin",
        genericName: "Acetylsalicylic Acid",
        dosage: "75mg",
        form: "Tablet",
        manufacturer: "PharmaCorp International",
        batchNumber: "PC2024004",
        expiryDate: new Date("2025-09-20"),
        quantity: 15,
        unitPrice: "0.15",
        sellingPrice: "0.35",
        minimumStock: 50,
        category: "Pain Relief",
        description: "Low-dose aspirin for heart health and pain relief",
        barcode: "1234567890126"
      },
      {
        name: "Insulin",
        genericName: "Human Insulin",
        dosage: "100IU/ml",
        form: "Injection",
        manufacturer: "MediSupply Solutions",
        batchNumber: "MS2024005",
        expiryDate: new Date("2025-04-10"),
        quantity: 8,
        unitPrice: "25.00",
        sellingPrice: "50.00",
        minimumStock: 25,
        category: "Diabetes",
        description: "Rapid-acting insulin for diabetes management",
        barcode: "1234567890127"
      },
      {
        name: "Ventolin Inhaler",
        genericName: "Salbutamol",
        dosage: "100mcg",
        form: "Inhaler",
        manufacturer: "HealthDistributors Ltd",
        batchNumber: "HD2024006",
        expiryDate: new Date("2025-08-05"),
        quantity: 12,
        unitPrice: "15.00",
        sellingPrice: "30.00",
        minimumStock: 30,
        category: "Respiratory",
        description: "Bronchodilator for asthma and COPD",
        barcode: "1234567890128"
      }
    ]).onConflictDoNothing().returning();

    console.log(`Created ${insertedDrugs.length} drugs`);
    console.log("Database seeding completed successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}