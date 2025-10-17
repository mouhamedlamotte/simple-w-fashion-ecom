-- Active: 1760655232530@@ep-little-pond-ad9kgtn3-pooler.c-2.us-east-1.aws.neon.tech@5432@neondb
-- Reset all tables
TRUNCATE "ProductImage", "OrderItem", "Order", "Product", "Category", "User", "BlogPost" RESTART IDENTITY CASCADE;

-- Insert admin user (password = 'admin123' -> à hasher côté app)
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  'admin_' || to_char(NOW(), 'YYYYMMDDHH24MISS'),
  'mouhamed@gmail.com',
  '$2b$10$AS8TGfkK.ucVXh8.xDuO1.DG6nwvCzodvyBhsv9lMTkV1WIjolrLG',
  'Mouhamed',
  'ADMIN',
  NOW(),
  NOW()
);

-- Insert categories
INSERT INTO "Category" (id, name, slug, description, "createdAt", "updatedAt") VALUES
('cat_1', 'Vêtements', 'vetements', 'Tous les vêtements', NOW(), NOW())

-- Insert products
INSERT INTO "Product" (id, name, slug, description, price, stock, "categoryId", "createdAt", "updatedAt") VALUES
('prod_1', 'Robe Anderson', 'robe-anderson', 'Robe élégante de la collection Fashion Show 2019', 30000.00, 10, 'cat_1', NOW(), NOW()),
('prod_2', 'Costume Femme Beige', 'costume-femme-beige', 'Costume élégant pour femmes professionnelles', 50000.00, 15, 'cat_1', NOW(), NOW()),
('prod_3', 'Ensemble Noir Élégant', 'ensemble-noir-elegant', 'Ensemble complet noir pour occasions formelles', 20000.00, 20, 'cat_1', NOW(), NOW()),
('prod_4', 'Costume Rose Vif', 'costume-rose-vif', 'Costume audacieux et moderne', 25000.00, 8, 'cat_1', NOW(), NOW());

-- Insert product images
INSERT INTO "ProductImage" (id, url, "productId", "createdAt") VALUES
('img_1', '/fashion.svg', 'prod_1', NOW()),
('img_2', '/fashion1.png', 'prod_2', NOW()),
('img_3', '/fashion2.png', 'prod_3', NOW()),
('img_4', '/fashion3.png', 'prod_4', NOW());

-- Example blog post
INSERT INTO "BlogPost" (id, title, slug, content, excerpt, published, "createdAt", "updatedAt") VALUES
('post_1', 'Nouvelle collection été', 'nouvelle-collection-ete', 'Découvrez notre nouvelle collection été 2025 !', 'Nouvelle collection été 2025', TRUE, NOW(), NOW());

-- Optional feedback
SELECT '✅ Database seeded successfully! Admin: admin@example.com / admin123' AS message;
