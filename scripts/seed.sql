-- Reset all tables
TRUNCATE "ProductImage", "OrderItem", "Order", "Product", "Category", "User", "BlogPost" RESTART IDENTITY CASCADE;

-- Insert admin user (password = 'admin123' -> à hasher côté app)
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  'admin_' || to_char(NOW(), 'YYYYMMDDHH24MISS'),
  'admin@example.com',
  '$2b$10$TvtUohbXJYxdEGx7bAQLaO9Gmrd70lWsuU3gEMcMt4ImM5Ipl78Ca', -- bcrypt('admin123')
  'Admin User',
  'ADMIN',
  NOW(),
  NOW()
);

-- Insert categories
INSERT INTO "Category" (id, name, slug, description, "createdAt", "updatedAt") VALUES
('cat_1', 'Vêtements', 'vetements', 'Tous les vêtements', NOW(), NOW()),
('cat_2', 'Accessoires', 'accessoires', 'Tous les accessoires', NOW(), NOW()),
('cat_3', 'Chaussures', 'chaussures', 'Toutes les chaussures', NOW(), NOW());

-- Insert products
INSERT INTO "Product" (id, name, slug, description, price, stock, "categoryId", "createdAt", "updatedAt") VALUES
('prod_1', 'Robe Anderson', 'robe-anderson', 'Robe élégante de la collection Fashion Show 2019', 2800.00, 10, 'cat_1', NOW(), NOW()),
('prod_2', 'Costume Femme Beige', 'costume-femme-beige', 'Costume élégant pour femmes professionnelles', 238.98, 15, 'cat_1', NOW(), NOW()),
('prod_3', 'Ensemble Noir Élégant', 'ensemble-noir-elegant', 'Ensemble complet noir pour occasions formelles', 22.76, 20, 'cat_1', NOW(), NOW()),
('prod_4', 'Costume Rose Vif', 'costume-rose-vif', 'Costume audacieux et moderne', 25.99, 8, 'cat_1', NOW(), NOW());

-- Insert product images
INSERT INTO "ProductImage" (id, url, "productId", "createdAt") VALUES
('img_1', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aWS2AyBhGUeUGKj6GtVuCgFrucgRlv.png', 'prod_1', NOW()),
('img_2', '/placeholder.svg?height=400&width=300', 'prod_2', NOW()),
('img_3', '/placeholder.svg?height=400&width=300', 'prod_3', NOW()),
('img_4', '/placeholder.svg?height=400&width=300', 'prod_4', NOW());

-- Example blog post
INSERT INTO "BlogPost" (id, title, slug, content, excerpt, published, "createdAt", "updatedAt") VALUES
('post_1', 'Nouvelle collection été', 'nouvelle-collection-ete', 'Découvrez notre nouvelle collection été 2025 !', 'Nouvelle collection été 2025', TRUE, NOW(), NOW());

-- Optional feedback
SELECT '✅ Database seeded successfully! Admin: admin@example.com / admin123' AS message;
