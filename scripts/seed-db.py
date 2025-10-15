import sqlite3
import os
import bcrypt
from datetime import datetime

db_path = os.path.join(os.path.dirname(__file__), '..', 'prisma', 'dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Hash password 
def hash_password(password):
    return bcrypt.hash(password, 10)

# Create admin user
admin_id = 'admin_' + datetime.now().strftime('%Y%m%d%H%M%S')
cursor.execute('''
    INSERT INTO User (id, email, password, name, role, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
''', (admin_id, 'admin@example.com', hash_password('admin123'), 'Admin User', 'ADMIN', datetime.now().isoformat(), datetime.now().isoformat()))

# Create categories
categories = [
    ('cat_1', 'Vêtements', 'vetements', 'Tous les vêtements'),
    ('cat_2', 'Accessoires', 'accessoires', 'Tous les accessoires'),
    ('cat_3', 'Chaussures', 'chaussures', 'Toutes les chaussures'),
]

for cat in categories:
    cursor.execute('''
        INSERT INTO Category (id, name, slug, description, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (*cat, datetime.now().isoformat(), datetime.now().isoformat()))

# Create sample products
products = [
    ('prod_1', 'Robe Anderson', 'robe-anderson', 'Robe élégante de la collection Fashion Show 2019', 2800.00, 10, 'cat_1'),
    ('prod_2', 'Costume Femme Beige', 'costume-femme-beige', 'Costume élégant pour femmes professionnelles', 238.98, 15, 'cat_1'),
    ('prod_3', 'Ensemble Noir Élégant', 'ensemble-noir-elegant', 'Ensemble complet noir pour occasions formelles', 22.76, 20, 'cat_1'),
    ('prod_4', 'Costume Rose Vif', 'costume-rose-vif', 'Costume audacieux et moderne', 25.99, 8, 'cat_1'),
]

for prod in products:
    cursor.execute('''
        INSERT INTO Product (id, name, slug, description, price, stock, categoryId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (*prod, datetime.now().isoformat(), datetime.now().isoformat()))

# Add product images
images = [
    ('img_1', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aWS2AyBhGUeUGKj6GtVuCgFrucgRlv.png', 'prod_1'),
    ('img_2', '/placeholder.svg?height=400&width=300', 'prod_2'),
    ('img_3', '/placeholder.svg?height=400&width=300', 'prod_3'),
    ('img_4', '/placeholder.svg?height=400&width=300', 'prod_4'),
]

for img in images:
    cursor.execute('''
        INSERT INTO ProductImage (id, url, productId, createdAt)
        VALUES (?, ?, ?, ?)
    ''', (*img, datetime.now().isoformat()))

conn.commit()
conn.close()

print("Database seeded successfully!")
print("Admin credentials: admin@example.com / admin123")
