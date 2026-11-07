/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  SuitProduct,
  CustomBespokeConfig,
  CartItem,
  CurrencyCode,
  BespokeMeasurements,
  AtelierAppointment,
  OrderTrackingInfo,
} from './types/suit';
import { SUIT_CATALOG, LUXURY_FABRICS } from './data/suitCatalog';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SuitAssemblySection } from './components/SuitAssemblySection';
import { CollectionShowcase } from './components/CollectionShowcase';
import { InteractiveStudioSection } from './components/InteractiveStudioSection';
import { AiMeasurementStudio } from './components/AiMeasurementStudio';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { OrderTrackingView } from './components/OrderTrackingView';
import { Footer } from './components/Footer';
import { BespokeCustomizerModal } from './components/BespokeCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AppointmentModal } from './components/AppointmentModal';
import { StyleDiscoveryQuizModal } from './components/StyleDiscoveryQuizModal';
import { StyleQuizBanner } from './components/StyleQuizBanner';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('USD');
  const [activeSection, setActiveSection] = useState('hero');

  // Bespoke Wardrobe Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'default-cart-item-1',
      config: {
        suitId: 'sovereign-black-tie',
        suitName: 'The Sovereign Black-Tie Tuxedo',
        gender: 'men',
        fabric: LUXURY_FABRICS[0],
        lapel: 'peak',
        buttons: '1-button',
        vents: 'side-vents',
        silhouette: 'savile-row-structured',
        monogramText: 'AS',
        monogramColor: 'champagne-gold',
        liningColor: '#121216',
        trouserPleats: 'flat-front',
        waistAdjusters: 'side-tabs-brass',
        totalPriceUsd: 2925,
      },
      quantity: 1,
      packagingOption: 'cedar-travel-trunk',
    },
  ]);

  // UI Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isStyleQuizOpen, setIsStyleQuizOpen] = useState(false);
  const [activeCustomizerSuit, setActiveCustomizerSuit] = useState<SuitProduct | null>(null);

  // Biometric tailoring profile
  const [savedMeasurements, setSavedMeasurements] = useState<BespokeMeasurements | undefined>(undefined);

  // Active tracking order
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<OrderTrackingInfo | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Scroll navigation helper
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cart operations
  const handleAddCustomConfigToCart = (config: CustomBespokeConfig) => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      config: {
        ...config,
        measurementsApplied: savedMeasurements,
      },
      quantity: 1,
      packagingOption: 'signature-box',
    };
    setCartItems((prev) => [...prev, newItem]);
    showToast(`Added ${config.suitName} to your Bespoke Wardrobe.`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdatePackaging = (
    id: string,
    pkg: 'signature-box' | 'cedar-travel-trunk' | 'leather-garment-carrier'
  ) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, packagingOption: pkg } : item))
    );
  };

  // Quick commission from catalog
  const handleQuickCommission = (suit: SuitProduct) => {
    const defaultFabric = LUXURY_FABRICS.find((f) => f.id === suit.fabricDefault) || LUXURY_FABRICS[0];
    const config: CustomBespokeConfig = {
      suitId: suit.id,
      suitName: suit.name,
      gender: suit.gender,
      fabric: defaultFabric,
      lapel: suit.lapelDefault,
      buttons: suit.buttonDefault,
      vents: 'side-vents',
      silhouette: suit.silhouetteDefault,
      monogramText: '',
      monogramColor: 'champagne-gold',
      liningColor: '#121216',
      trouserPleats: 'flat-front',
      waistAdjusters: 'side-tabs-brass',
      totalPriceUsd: suit.basePriceUsd + defaultFabric.extraCostUsd,
      measurementsApplied: savedMeasurements,
    };
    handleAddCustomConfigToCart(config);
  };

  // AI Measurements save
  const handleApplyMeasurements = (measurements: BespokeMeasurements) => {
    setSavedMeasurements(measurements);
    showToast('Biometric posture pattern saved to your bespoke profile.');
  };

  // Appointment confirmation
  const handleConfirmAppointment = (appt: AtelierAppointment) => {
    showToast(`Fitting reserved at ${appt.locationName.split('·')[0]}. Confirmation #${appt.id}`);
  };

  // Checkout order completed
  const handleOrderSuccess = (order: OrderTrackingInfo) => {
    setActiveTrackingOrder(order);
    setCartItems([]);
    showToast(`Order ${order.orderId} commissioned. Live dispatch tracking active.`);
    handleNavigate('order-tracking');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F3F4F6] flex flex-col font-sans">
      {/* Top Banner: International Bespoke Promise */}
      <div className="bg-[#121218] border-b border-[#222228] py-2 px-4 text-center text-[11px] text-[#C5A880] tracking-widest uppercase font-medium">
        <span>Complimentary Insured Diplomatic Transit Worldwide</span>
        <span className="mx-2 opacity-50">·</span>
        <span>Savile Row & Milanese Master Tailoring</span>
        <span className="mx-2 opacity-50">·</span>
        <span>100% Bespoke Fit Guarantee</span>
      </div>

      {/* Primary Top Bar Contract Compliant Navigation */}
      <Navbar
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onOpenConsultation={() => setIsAppointmentModalOpen(true)}
        onOpenStyleQuiz={() => setIsStyleQuizOpen(true)}
      />

      <main className="flex-1">
        {/* Editorial Hero */}
        <Hero
          onOpen3DStudio={() => handleNavigate('3d-studio')}
          onExploreCollections={() => handleNavigate('collections')}
          onOpenMeasurementStudio={() => handleNavigate('ai-measurements')}
          onOpenStyleQuiz={() => setIsStyleQuizOpen(true)}
          onScrollToAssembly={() => handleNavigate('suit-assembly')}
        />

        {/* Scroll-Driven Rocket-Style Sartorial Suit Assembly */}
        <SuitAssemblySection
          currentCurrency={currentCurrency}
          onCustomizeLook={() => setActiveCustomizerSuit(SUIT_CATALOG[0])}
          onExploreCollections={() => handleNavigate('collections')}
        />

        {/* Curated Suits for Men & Women (All Occasions) */}
        <CollectionShowcase
          currentCurrency={currentCurrency}
          onSelectSuitFor3D={(suit) => setActiveCustomizerSuit(suit)}
          onQuickCommission={handleQuickCommission}
        />

        {/* AI Style Discovery Quiz Banner */}
        <StyleQuizBanner onOpenQuiz={() => setIsStyleQuizOpen(true)} />

        {/* Interactive 3D Fitting Studio & Photo Try-on Section */}
        <InteractiveStudioSection
          currentCurrency={currentCurrency}
          onAddToCart={handleAddCustomConfigToCart}
          onOpenMeasurements={() => handleNavigate('ai-measurements')}
          onOpenConsultation={() => setIsAppointmentModalOpen(true)}
        />

        {/* AI Measurement & Posture Scanner */}
        <AiMeasurementStudio
          onApplyMeasurements={handleApplyMeasurements}
          savedMeasurements={savedMeasurements}
        />

        {/* Master Craftsmanship & Mill Heritage */}
        <CraftsmanshipSection />

        {/* Automated Order Tracking System */}
        <OrderTrackingView initialOrder={activeTrackingOrder} />
      </main>

      {/* Global Ateliers & Care Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenConsultation={() => setIsAppointmentModalOpen(true)}
      />

      {/* AI Style Discovery Quiz Modal */}
      <StyleDiscoveryQuizModal
        isOpen={isStyleQuizOpen}
        onClose={() => setIsStyleQuizOpen(false)}
        currentCurrency={currentCurrency}
        onSelectSuitFor3DCustomizer={(suit) => {
          setActiveCustomizerSuit(suit);
          setIsStyleQuizOpen(false);
        }}
        onOpenConsultation={() => {
          setIsStyleQuizOpen(false);
          setIsAppointmentModalOpen(true);
        }}
      />

      {/* 3D Customizer Modal (Deep Dive) */}
      {activeCustomizerSuit && (
        <BespokeCustomizerModal
          suit={activeCustomizerSuit}
          currentCurrency={currentCurrency}
          onClose={() => setActiveCustomizerSuit(null)}
          onAddToCart={handleAddCustomConfigToCart}
          onOpenMeasurements={() => {
            setActiveCustomizerSuit(null);
            handleNavigate('ai-measurements');
          }}
        />
      )}

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onUpdatePackaging={handleUpdatePackaging}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        currentCurrency={currentCurrency}
      />

      {/* Secure International Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currentCurrency={currentCurrency}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Appointment & Virtual Stylist Modal */}
      {isAppointmentModalOpen && (
        <AppointmentModal
          onClose={() => setIsAppointmentModalOpen(false)}
          onConfirmAppointment={handleConfirmAppointment}
        />
      )}

      {/* Luxury Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14141A] text-[#F3F4F6] border border-[#C5A880]/60 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0" />
          <span className="text-xs font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
