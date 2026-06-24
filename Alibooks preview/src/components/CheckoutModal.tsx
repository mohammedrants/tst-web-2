import React, { useState } from 'react';
import { X, CheckCircle, Truck, ShoppingBag, Landmark, MessageSquare, ArrowRight, ExternalLink } from 'lucide-react';
import { CartItem, Order } from '../types';
import { LAHORE_AREAS } from '../data/books';
import { motion } from 'motion/react';

interface CheckoutModalProps {
  cart: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export default function CheckoutModal({ cart, subtotal, deliveryFee, total, onClose, onOrderSuccess }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    area: LAHORE_AREAS[0],
    deliveryMethod: 'delivery' // 'delivery' | 'pickup'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedUrl, setGeneratedUrl] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'WhatsApp number is required';
    } else if (!/^((\+92)|(0092)|(0))3\d{9}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Please enter a valid Pakistan mobile number (e.g., 03319122339)';
    }
    if (formData.deliveryMethod === 'delivery' && !formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getWhatsAppMessage = (finalDeliveryFee: number, finalTotal: number) => {
    const storePhone = "923319122339";
    const header = "📚 *NEW ORDER FROM ALIBOOKS LAHORE* 📚\n\n";
    
    const customerDetails = `👤 *Customer Details:*\n` +
      `- *Name:* ${formData.name}\n` +
      `- *Phone/WhatsApp:* ${formData.phone}\n` +
      `- *Method:* ${formData.deliveryMethod === 'pickup' ? 'Store Pickup (Urdu Bazar)' : `Home Delivery (${formData.area})`}\n` +
      (formData.deliveryMethod === 'delivery' ? `- *Address:* ${formData.address}\n` : '') +
      `\n`;

    const itemsList = `🛍️ *Order Items:*\n` +
      cart.map((item, index) => {
        const itemTotal = item.book.price * item.quantity;
        return `${index + 1}. *${item.book.title}* (${item.book.type}) x ${item.quantity} = Rs. ${itemTotal.toLocaleString()}`;
      }).join('\n') +
      `\n\n`;

    const summary = `-----------------------------------\n` +
      `💵 *Subtotal:* Rs. ${subtotal.toLocaleString()}\n` +
      `🚚 *Delivery Charges:* Rs. ${finalDeliveryFee.toLocaleString()}\n` +
      `💰 *TOTAL DUE:* Rs. ${finalTotal.toLocaleString()}\n` +
      `-----------------------------------\n\n` +
      `_Please confirm my order from the website!_`;

    const fullMessage = header + customerDetails + itemsList + summary;
    const encoded = encodeURIComponent(fullMessage);
    return `https://api.whatsapp.com/send?phone=${storePhone}&text=${encoded}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalDeliveryFee = formData.deliveryMethod === 'pickup' ? 0 : deliveryFee;
    const finalTotal = subtotal + finalDeliveryFee;
    
    const waUrl = getWhatsAppMessage(finalDeliveryFee, finalTotal);
    setGeneratedUrl(waUrl);

    // Call success handler so parent can update (or clear state/toast if appropriate)
    const randomId = `ALIBOOKS-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: randomId,
      customerName: formData.name,
      phone: formData.phone,
      email: '',
      address: formData.deliveryMethod === 'pickup' ? 'Store Pickup: Main Urdu Bazar, Lahore' : formData.address,
      area: formData.deliveryMethod === 'pickup' ? 'Urdu Bazar' : formData.area,
      items: cart,
      subtotal,
      deliveryFee: finalDeliveryFee,
      total: finalTotal,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending'
    };
    onOrderSuccess(newOrder);

    // Trigger WhatsApp redirect
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    
    setStep(2); // Go to WhatsApp instructions/confirm page
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" id="checkout-modal">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer" onClick={onClose} />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden z-10 max-h-[90vh] flex flex-col border border-slate-100"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4.5 border-b border-slate-100 bg-orange-50/40">
          <h3 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase flex items-center gap-2">
            <MessageSquare className="text-orange-600" size={18} />
            {step === 1 ? 'Order via WhatsApp' : 'Redirecting to WhatsApp...'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 bg-white text-slate-400 rounded-full hover:bg-orange-600 hover:text-white transition-colors cursor-pointer border border-slate-100"
            id="close-checkout-btn"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-grow">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Method Selector */}
              <div className="grid grid-cols-2 gap-4">
                <label 
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                    formData.deliveryMethod === 'delivery' 
                      ? 'border-orange-500 bg-orange-50/40 text-orange-700' 
                      : 'border-slate-100 hover:border-orange-200 text-slate-600 bg-slate-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="deliveryMethod" 
                    value="delivery" 
                    checked={formData.deliveryMethod === 'delivery'} 
                    onChange={() => setFormData({ ...formData, deliveryMethod: 'delivery' })}
                    className="sr-only"
                  />
                  <Truck size={22} className="mb-2" />
                  <span className="font-extrabold text-xs tracking-wider uppercase">Home Delivery</span>
                  <span className="text-[10px] opacity-80 mt-1">Lahore 24H Delivery</span>
                </label>

                <label 
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                    formData.deliveryMethod === 'pickup' 
                      ? 'border-orange-500 bg-orange-50/40 text-orange-700' 
                      : 'border-slate-100 hover:border-orange-200 text-slate-600 bg-slate-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="deliveryMethod" 
                    value="pickup" 
                    checked={formData.deliveryMethod === 'pickup'} 
                    onChange={() => setFormData({ ...formData, deliveryMethod: 'pickup' })}
                    className="sr-only"
                  />
                  <Landmark size={22} className="mb-2" />
                  <span className="font-extrabold text-xs tracking-wider uppercase">Store Pickup</span>
                  <span className="text-[10px] opacity-80 mt-1">Main Urdu Bazar, LHR</span>
                </label>
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <h4 className="font-black text-xs text-slate-700 uppercase tracking-widest pb-1 border-b border-slate-100">
                  Customer Details
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Your Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Muhammad Ali"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full border rounded-xl py-2 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                        errors.name ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-orange-500 bg-slate-50/50'
                      }`}
                      id="checkout-name"
                    />
                    {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">WhatsApp Mobile Number *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 03319122339"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full border rounded-xl py-2 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                        errors.phone ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-orange-500 bg-slate-50/50'
                      }`}
                      id="checkout-phone"
                    />
                    {errors.phone && <p className="text-[10px] text-rose-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              {formData.deliveryMethod === 'delivery' && (
                <div className="space-y-4">
                  <h4 className="font-black text-xs text-slate-700 uppercase tracking-widest pb-1 border-b border-slate-100">
                    Lahore Delivery Destination
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Area in Lahore *</label>
                      <select 
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl py-2 px-4 text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-slate-50/50"
                        id="checkout-area"
                      >
                        {LAHORE_AREAS.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Street Address *</label>
                      <input 
                        type="text" 
                        placeholder="House #, Block Name, Landmark"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={`w-full border rounded-xl py-2 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                          errors.address ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-orange-500 bg-slate-50/50'
                        }`}
                        id="checkout-address"
                      />
                      {errors.address && <p className="text-[10px] text-rose-500 mt-1">{errors.address}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Pickup Notice */}
              {formData.deliveryMethod === 'pickup' && (
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-orange-700">📍 Urdu Bazar Lahore Outlet:</p>
                  <p className="text-[11px]">Ali Books Store, Main Urdu Bazar, Lahore.</p>
                  <p className="font-bold text-orange-700 mt-2">🕒 Collection Timings:</p>
                  <p className="text-[11px]">11:00 AM to 9:00 PM (Monday - Saturday)</p>
                  <p className="mt-2 text-[10px] text-slate-500">We will bundle your books. Pick up and pay directly in cash at the store!</p>
                </div>
              )}

              {/* Summary & Place Button */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-800">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping Mode:</span>
                    <span className="font-bold text-slate-800">
                      {formData.deliveryMethod === 'pickup' ? 'Free Store Pickup' : `Lahore Home Delivery`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Charges:</span>
                    <span className="font-bold text-slate-800">
                      {formData.deliveryMethod === 'pickup' ? 'Rs. 0' : deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-800 pt-1.5 border-t border-dashed border-slate-200">
                    <span>Total Order Amount:</span>
                    <span className="text-orange-600 text-base">
                      Rs. {(formData.deliveryMethod === 'pickup' ? subtotal : total).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-slate-500 text-center leading-relaxed">
                  🛒 Pressing the button below will instantly bundle your items and open WhatsApp to send your order directly to the seller at Urdu Bazar.
                </div>

                <button 
                  type="submit"
                  className="w-full min-h-12 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm text-center"
                  id="place-order-submit-btn"
                >
                  <MessageSquare size={16} className="shrink-0" />
                  <span className="leading-tight">Send Order to Seller via WhatsApp</span>
                  <ArrowRight size={14} className="shrink-0" />
                </button>
              </div>
            </form>
          ) : (
            /* SUCCESS REDIRECT VIEW */
            <div className="text-center py-10 space-y-6">
              <div className="inline-flex items-center justify-center p-4 bg-emerald-50 text-emerald-600 rounded-full animate-pulse">
                <MessageSquare size={48} />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-black text-slate-800">Opening WhatsApp...</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  We have generated your customized Urdu Bazar order message and redirected you to the seller. If the WhatsApp window did not open automatically, please click the button below to complete your order.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="bg-slate-50 rounded-2xl p-5 text-left max-w-md mx-auto border border-slate-100 space-y-3 text-xs">
                <div className="flex justify-between pb-1 border-b border-slate-200 text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">
                  <span>Order Summary Bundle</span>
                  <span className="text-emerald-600 font-black">WHATSAPP ORDER</span>
                </div>

                <div className="space-y-1 font-semibold text-slate-600">
                  <p><strong className="text-slate-800">Receiver:</strong> Ali Books Store (Urdu Bazar)</p>
                  <p><strong className="text-slate-800">Recipient Name:</strong> {formData.name}</p>
                  <p><strong className="text-slate-800">Recipient Mobile:</strong> {formData.phone}</p>
                  <p><strong className="text-slate-800">Delivery:</strong> {formData.deliveryMethod === 'pickup' ? 'Store Pickup (Urdu Bazar, Lahore)' : `Home Delivery (${formData.area})`}</p>
                  <p><strong className="text-slate-800">Total Items:</strong> {cart.reduce((sum, i) => sum + i.quantity, 0)} items</p>
                </div>

                <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center text-xs font-black">
                  <span className="text-slate-700">Total Bill Payable:</span>
                  <span className="text-emerald-600 text-sm">Rs. {(formData.deliveryMethod === 'pickup' ? subtotal : total).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-4">
                <a 
                  href={generatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 flex-1 text-xs"
                  id="success-manual-wa-btn"
                >
                  <span>Click here to open WhatsApp</span>
                  <ExternalLink size={14} />
                </a>
                <button 
                  onClick={onClose}
                  className="px-6 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold transition-all cursor-pointer text-xs"
                  id="success-continue-shopping-btn"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

