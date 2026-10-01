package com.hcl.stocksmart.config;

import com.hcl.stocksmart.entity.*;
import com.hcl.stocksmart.enums.Role;
import com.hcl.stocksmart.repository.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class DataInitializer implements ApplicationRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final LocationRepository locationRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;
    private final PurchaseRepository purchaseRepository;
    private final PurchaseItemRepository purchaseItemRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            LocationRepository locationRepository,
            SupplierRepository supplierRepository,
            InventoryRepository inventoryRepository,
            PurchaseRepository purchaseRepository,
            PurchaseItemRepository purchaseItemRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.locationRepository = locationRepository;
        this.supplierRepository = supplierRepository;
        this.inventoryRepository = inventoryRepository;
        this.purchaseRepository = purchaseRepository;
        this.purchaseItemRepository = purchaseItemRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        seedDataset();
    }

    private void seedDataset() {
        // 1. Categories
        Category electronics = getOrCreateCategory("Electronics", "Electronic accessories and devices");
        Category clothing = getOrCreateCategory("Clothing", "Clothing and apparel products");
        Category homeLiving = getOrCreateCategory("Home & Living", "Household and lifestyle products");
        Category stationery = getOrCreateCategory("Stationery", "Office and study supplies");
        Category sports = getOrCreateCategory("Sports", "Sports and fitness products");

        // 2. Location
        Location mainWarehouse = getOrCreateLocation("Main Warehouse", "Warehouse", "Central City");

        // 3. Suppliers
        Supplier supplier1 = getOrCreateSupplier("TechSource Global", "tech@source.com", "9876543210", "Tech City");
        Supplier supplier2 = getOrCreateSupplier("StyleApparel Ltd", "contact@styleapparel.com", "9876543211", "Metro City");
        Supplier supplier3 = getOrCreateSupplier("SportsDirect", "sales@sportsdirect.com", "9876543212", "Sports Complex");

        // 4. Products & Inventory Dataset
        Product p1 = seedProduct("ELEC-001", "Wireless Mouse", "2.4 GHz wireless optical mouse", electronics, new BigDecimal("799.0"), 25, 10, "890100000001", mainWarehouse);
        Product p2 = seedProduct("ELEC-002", "USB-C Cable", "1 meter USB-C charging/data cable", electronics, new BigDecimal("299.0"), 40, 15, "890100000002", mainWarehouse);
        Product p3 = seedProduct("ELEC-003", "Bluetooth Keyboard", "Compact wireless keyboard", electronics, new BigDecimal("1299.0"), 12, 8, "890100000003", mainWarehouse);

        Product p4 = seedProduct("CLOT-001", "Cotton T-Shirt", "Regular fit cotton T-shirt", clothing, new BigDecimal("499.0"), 30, 10, "890100000004", mainWarehouse);
        Product p5 = seedProduct("CLOT-002", "Hoodie", "Comfortable cotton-blend hoodie", clothing, new BigDecimal("999.0"), 7, 8, "890100000005", mainWarehouse);

        Product p6 = seedProduct("HOME-001", "Water Bottle", "Stainless steel reusable bottle", homeLiving, new BigDecimal("399.0"), 18, 8, "890100000006", mainWarehouse);
        Product p7 = seedProduct("HOME-002", "Desk Lamp", "LED study and work desk lamp", homeLiving, new BigDecimal("899.0"), 5, 6, "890100000007", mainWarehouse);

        Product p8 = seedProduct("STAT-001", "Notebook A4", "200-page ruled notebook", stationery, new BigDecimal("120.0"), 50, 15, "890100000008", mainWarehouse);
        Product p9 = seedProduct("STAT-002", "Stapler", "Medium office stapler", stationery, new BigDecimal("180.0"), 9, 10, "890100000009", mainWarehouse);

        Product p10 = seedProduct("SPRT-001", "Yoga Mat", "Non-slip exercise yoga mat", sports, new BigDecimal("699.0"), 14, 7, "890100000010", mainWarehouse);

        // 5. Purchases & Purchase Items Dataset
        if (purchaseRepository.count() == 0) {
            // Purchase 1
            Purchase pur1 = new Purchase();
            pur1.setSupplier(supplier1);
            pur1.setLocation(mainWarehouse);
            pur1.setTotalAmount(new BigDecimal("16797.0"));
            pur1.setStatus("RECEIVED");
            pur1.setPurchaseDate(LocalDateTime.now().minusDays(3));
            pur1 = purchaseRepository.save(pur1);

            createPurchaseItem(pur1, p10, 10, new BigDecimal("699.0"), new BigDecimal("6990.0"));
            createPurchaseItem(pur1, p1, 10, new BigDecimal("799.0"), new BigDecimal("7990.0"));
            createPurchaseItem(pur1, p2, 10, new BigDecimal("299.0"), new BigDecimal("2990.0"));

            // Purchase 2
            Purchase pur2 = new Purchase();
            pur2.setSupplier(supplier2);
            pur2.setLocation(mainWarehouse);
            pur2.setTotalAmount(new BigDecimal("9990.0"));
            pur2.setStatus("RECEIVED");
            pur2.setPurchaseDate(LocalDateTime.now().minusDays(2));
            pur2 = purchaseRepository.save(pur2);

            createPurchaseItem(pur2, p4, 10, new BigDecimal("499.0"), new BigDecimal("4990.0"));
            createPurchaseItem(pur2, p6, 10, new BigDecimal("499.0"), new BigDecimal("4990.0"));

            // Purchase 3
            Purchase pur3 = new Purchase();
            pur3.setSupplier(supplier3);
            pur3.setLocation(mainWarehouse);
            pur3.setTotalAmount(new BigDecimal("4500.0"));
            pur3.setStatus("PENDING");
            pur3.setPurchaseDate(LocalDateTime.now().minusDays(1));
            pur3 = purchaseRepository.save(pur3);

            createPurchaseItem(pur3, p5, 5, new BigDecimal("900.0"), new BigDecimal("4500.0"));
        }
    }

    private Category getOrCreateCategory(String name, String desc) {
        Optional<Category> opt = categoryRepository.findAll().stream().filter(c -> c.getName().equalsIgnoreCase(name)).findFirst();
        if (opt.isPresent()) return opt.get();
        Category c = new Category();
        c.setName(name);
        c.setDescription(desc);
        return categoryRepository.save(c);
    }

    private Location getOrCreateLocation(String name, String type, String address) {
        Optional<Location> opt = locationRepository.findAll().stream().filter(l -> l.getName().equalsIgnoreCase(name)).findFirst();
        if (opt.isPresent()) return opt.get();
        Location l = new Location();
        l.setName(name);
        l.setType(type);
        l.setAddress(address);
        return locationRepository.save(l);
    }

    private Supplier getOrCreateSupplier(String name, String email, String phone, String address) {
        Optional<Supplier> opt = supplierRepository.findAll().stream().filter(s -> s.getName().equalsIgnoreCase(name)).findFirst();
        if (opt.isPresent()) return opt.get();
        Supplier s = new Supplier();
        s.setName(name);
        s.setEmail(email);
        s.setPhone(phone);
        s.setAddress(address);
        return supplierRepository.save(s);
    }

    private Product seedProduct(
            String sku, String name, String desc, Category category,
            BigDecimal price, int quantity, int reorderLevel, String barcode, Location location) {

        Optional<Product> existing = productRepository.findAll().stream().filter(p -> p.getSku().equalsIgnoreCase(sku)).findFirst();
        if (existing.isPresent()) {
            return existing.get();
        }

        Product p = new Product();
        p.setSku(sku);
        p.setName(name);
        p.setDescription(desc);
        p.setCategory(category);
        p.setPrice(price);
        p.setQuantity(quantity);
        p.setReorderLevel(reorderLevel);
        p.setBarcode(barcode);
        p.setActive(true);

        p = productRepository.save(p);

        Inventory inv = new Inventory();
        inv.setProduct(p);
        inv.setLocation(location);
        inv.setQuantity(quantity);
        inv.setReorderLevel(reorderLevel);
        inventoryRepository.save(inv);

        return p;
    }

    private void createPurchaseItem(Purchase purchase, Product product, int quantity, BigDecimal unitCost, BigDecimal subtotal) {
        PurchaseItem item = new PurchaseItem();
        item.setPurchase(purchase);
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setUnitCost(unitCost);
        item.setSubtotal(subtotal);
        purchaseItemRepository.save(item);
    }
}
