import React, { useState, useEffect } from 'react';
import { Product, Shade, CartItem, CategoryFilter } from './types';
import { PRODUCTS } from './data/products';
import { Navbar } from './components/layout/Navbar';
import { Hero3DView } from './components/3d/Hero3DView';
import { CategoryBanners } from './components/shop/CategoryBanners';
import { SignatureProduct3D } from './components/3d/SignatureProduct3D';
import { ProductCatalog } from './components/shop/ProductCatalog';
import { EditorialSection } from './components/editorial/EditorialSection';
import { ShadeFinderModal } from './components/interactive/ShadeFinderModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { ProductModal3D } from './components/3d/ProductModal3D';
import { SearchOverlay } from './components/layout/SearchOverlay';
import { AccountModal } from './components/account/AccountModal';
import { Footer } from './components/layout/Footer';

const CART_STORAGE_KEY = 'velvera_cart_items_v1';
const USER_STORAGE_KEY = 'velvera_user_profile_v1';

export default function App() {
  // User Profile State with localStorage persistence
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; tier: string } | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : { name: 'Ananya Sharma', email: 'ananya.sharma@velvera.com', tier: 'Haute Privilège Member' };
    } catch {
      return { name: 'Ananya Sharma', email: 'ananya.sharma@velvera.com', tier: 'Haute Privilège Member' };
    }
  });

  // Cart State with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isShadeFinderOpen, setIsShadeFinderOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);

  // Catalog Category & Search Filter
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Save user & cart to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [currentUser]);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Cart Interactions
  const handleAddToCart = (product: Product, shade: Shade, quantity: number = 1) => {
    const itemId = `${product.id}-${shade.id}`;
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, { id: itemId, product, selectedShade: shade, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Smooth scroll helper
  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#141211] font-sans flex flex-col selection:bg-[#4A121A] selection:text-[#FAF7F2]">
      {/* 1. Header & Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenShadeFinder={() => setIsShadeFinderOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        currentUser={currentUser}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {/* 2. Hero Section — 3D Floating Cosmetic Centerpiece & Parallax */}
        <div id="hero">
          <Hero3DView
            onExploreClick={() => handleNavigate('catalog')}
            onStoryClick={() => handleNavigate('editorial')}
          />
        </div>

        {/* 3. Shop by Category (Editorial Banners) */}
        <CategoryBanners
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            handleNavigate('catalog');
          }}
        />

        {/* 4. Signature Product 3D Showroom (Dedicated Interactive 360° Customizer) */}
        <SignatureProduct3D
          product={PRODUCTS[0]}
          onAddToCart={handleAddToCart}
        />

        {/* 5. Interactive 3D Product Catalog */}
        <ProductCatalog
          products={PRODUCTS}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onInspect3D={(prod) => setInspectedProduct(prod)}
          onAddToCart={handleAddToCart}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 6. Beauty Editorial Campaign ("An Art Form. A Feeling. A Finish.") */}
        <EditorialSection
          onExploreCollection={() => handleNavigate('catalog')}
        />
      </main>

      {/* 7. Luxury Footer & Atelier Directory */}
      <Footer />

      {/* Overlays & Drawers */}
      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onExploreProducts={() => handleNavigate('catalog')}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderComplete={handleClearCart}
      />

      {/* 3D Quick Inspect Modal for Products */}
      <ProductModal3D
        product={inspectedProduct}
        onClose={() => setInspectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* "Find Your Shade" Diagnostic Modal */}
      <ShadeFinderModal
        isOpen={isShadeFinderOpen}
        onClose={() => setIsShadeFinderOpen(false)}
        onAddToCart={handleAddToCart}
        onInspect3D={(prod) => setInspectedProduct(prod)}
      />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => setInspectedProduct(prod)}
      />

      {/* Account Profile / Switch Account Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        onLogin={(name, email) => {
          setCurrentUser({
            name,
            email,
            tier: 'Haute Privilège Member',
          });
        }}
        onLogout={() => {
          setCurrentUser(null);
        }}
      />
    </div>
  );
}
