import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin, CreditCard, CheckCircle2,
  ChevronRight, ArrowLeft, Lock, ShoppingBag
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

// ─── Helpers ────────────────────────────────────────────────────────────────
const getUserId = () => localStorage.getItem('guestUserId');

const steps = [
  { id: 1, label: 'Delivery', icon: MapPin },
  { id: 2, label: 'Payment',  icon: CreditCard },
  { id: 3, label: 'Confirm',  icon: CheckCircle2 },
];

// ─── Stepper ─────────────────────────────────────────────────────────────────
const Stepper = ({ current }) => (
  <div className="flex items-center justify-center mb-10">
    {steps.map((s, i) => {
      const Icon = s.icon;
      const done    = current > s.id;
      const active  = current === s.id;
      return (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                done    ? 'bg-indigo-600 text-white' :
                active  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
                          'bg-gray-100 text-gray-400'
              }`}
            >
              {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
            </div>
            <span className={`mt-1.5 text-xs font-medium ${active || done ? 'text-indigo-600' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-3 mb-5 rounded-full transition-all duration-300 ${done ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Order Summary Sidebar ────────────────────────────────────────────────────
const OrderSummary = ({ cartItems, cartTotal }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28">
    <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
      <ShoppingBag className="w-5 h-5 text-indigo-500" />
      Order Summary
    </h3>
    <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
      {cartItems.map(item => {
        const product = item.product;
        if (!product) return null;
        const price = product.discount_price || product.price;
        return (
          <div key={item.product_id} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={product.images?.[0] || 'https://placehold.co/100'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-gray-800">${(price * item.quantity).toFixed(2)}</p>
          </div>
        );
      })}
    </div>
    <div className="border-t border-gray-100 pt-4 space-y-2">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Subtotal</span>
        <span>${cartTotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Shipping</span>
        <span className="text-green-600 font-medium">Free</span>
      </div>
      <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
        <span>Total</span>
        <span>${cartTotal.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

// ─── Address Field (must live outside AddressStep to keep stable identity) ────
const Field = ({ name, label, placeholder, type = 'text', half, form, errors, setForm, setErrors }) => (
  <div className={half ? 'col-span-1' : 'col-span-2'}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={form[name]}
      onChange={e => { setForm(p => ({ ...p, [name]: e.target.value })); setErrors(p => ({ ...p, [name]: '' })); }}
      placeholder={placeholder}
      className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors[name] ? 'border-red-400' : 'border-gray-200'}`}
    />
    {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
  </div>
);

// ─── Step 1: Address ─────────────────────────────────────────────────────────
const AddressStep = ({ onNext }) => {
  const [form, setForm] = useState({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Full name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone';
    if (!form.street.trim())  e.street  = 'Street address is required';
    if (!form.city.trim())    e.city    = 'City is required';
    if (!form.state.trim())   e.state   = 'State is required';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user_id: getUserId() })
      });
      const data = await res.json();
      onNext({ address: form, addressId: data.id });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-indigo-500" />
        Delivery Address
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <Field name="name"    label="Full Name"       placeholder="John Doe"         form={form} errors={errors} setForm={setForm} setErrors={setErrors} />
        <Field name="phone"   label="Phone Number"    placeholder="10-digit mobile"  form={form} errors={errors} setForm={setForm} setErrors={setErrors} type="tel" />
        <Field name="street"  label="Street Address"  placeholder="123 Main Street"  form={form} errors={errors} setForm={setForm} setErrors={setErrors} />
        <Field name="city"    label="City"            placeholder="Mumbai"           form={form} errors={errors} setForm={setForm} setErrors={setErrors} half />
        <Field name="state"   label="State"           placeholder="Maharashtra"      form={form} errors={errors} setForm={setForm} setErrors={setErrors} half />
        <Field name="pincode" label="Pincode"         placeholder="400001"           form={form} errors={errors} setForm={setForm} setErrors={setErrors} half />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? 'Saving…' : <>Save & Continue <ChevronRight className="w-4 h-4" /></>}
      </button>
    </form>
  );
};

// ─── Step 2: Payment ──────────────────────────────────────────────────────────
const PaymentStep = ({ addressData, cartItems, cartTotal, onNext, onBack }) => {
  const [card, setCard]   = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [method, setMethod] = useState('card'); // 'card' | 'cod'
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const formatCard = v => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = v => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  const validate = () => {
    if (method === 'cod') return {};
    const e = {};
    if (card.number.replace(/\s/g, '').length < 16) e.number = 'Enter 16-digit card number';
    if (!card.name.trim())  e.name   = 'Name on card is required';
    if (card.expiry.length < 5) e.expiry = 'Enter MM/YY';
    if (card.cvv.length < 3)    e.cvv    = 'Enter 3-digit CVV';
    return e;
  };

  const handlePay = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const itemsSnapshot = cartItems.map(i => ({
        product_id: i.product_id,
        name:       i.product?.name,
        price:      i.product?.discount_price || i.product?.price,
        image:      i.product?.images?.[0] || '',
        quantity:   i.quantity
      }));
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id:        getUserId(),
          total_amount:   cartTotal,
          status:         'PLACED',
          payment_method: method === 'cod' ? 'COD' : 'CARD',
          items:          itemsSnapshot,
          address:        addressData.address,
          address_id:     addressData.addressId
        })
      });
      const order = await res.json();
      onNext(order);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors[field] ? 'border-red-400' : 'border-gray-200'}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-indigo-500" />
        Payment
      </h2>

      {/* Method Toggle */}
      <div className="flex gap-3 mb-6">
        {['card', 'cod'].map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMethod(m)}
            className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
              method === m
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {m === 'card' ? '💳 Card' : '💵 Cash on Delivery'}
          </button>
        ))}
      </div>

      {method === 'card' && (
        <div className="space-y-4">
          {/* Card Visual */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white mb-2">
            <p className="text-xs uppercase tracking-widest opacity-70 mb-3">Credit / Debit Card</p>
            <p className="font-mono text-lg tracking-widest">
              {card.number || '•••• •••• •••• ••••'}
            </p>
            <div className="flex justify-between mt-4">
              <div>
                <p className="text-xs opacity-70">Card Holder</p>
                <p className="font-semibold text-sm">{card.name || 'YOUR NAME'}</p>
              </div>
              <div>
                <p className="text-xs opacity-70">Expires</p>
                <p className="font-semibold text-sm">{card.expiry || 'MM/YY'}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              value={card.number}
              onChange={e => { setCard(p => ({ ...p, number: formatCard(e.target.value) })); setErrors(p => ({ ...p, number: '' })); }}
              placeholder="1234 5678 9012 3456"
              className={inputCls('number')}
            />
            {errors.number && <p className="mt-1 text-xs text-red-500">{errors.number}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
            <input
              value={card.name}
              onChange={e => { setCard(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
              placeholder="John Doe"
              className={inputCls('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
              <input
                value={card.expiry}
                onChange={e => { setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) })); setErrors(p => ({ ...p, expiry: '' })); }}
                placeholder="MM/YY"
                maxLength={5}
                className={inputCls('expiry')}
              />
              {errors.expiry && <p className="mt-1 text-xs text-red-500">{errors.expiry}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="password"
                value={card.cvv}
                onChange={e => { setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })); setErrors(p => ({ ...p, cvv: '' })); }}
                placeholder="•••"
                maxLength={3}
                className={inputCls('cvv')}
              />
              {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>}
            </div>
          </div>
        </div>
      )}

      {method === 'cod' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-3">
          <span className="text-2xl">📦</span>
          <div>
            <p className="font-semibold mb-1">Cash on Delivery</p>
            <p className="text-amber-700">Have ${cartTotal.toFixed(2)} ready when your order arrives.</p>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Lock className="w-4 h-4" />
          {loading ? 'Processing…' : `Pay $${cartTotal.toFixed(2)}`}
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" /> Secured with 256-bit SSL encryption
      </p>
    </div>
  );
};

// ─── Step 3: Confirmation ─────────────────────────────────────────────────────
const ConfirmationStep = ({ order }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
    {/* Animated checkmark */}
    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
      <CheckCircle2 className="w-12 h-12 text-green-500" />
    </div>
    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed! 🎉</h2>
    <p className="text-gray-500 mb-1">Thank you for shopping with <span className="font-semibold text-indigo-600">ShopSmart</span></p>
    <p className="text-sm text-gray-400 mb-6">
      Order ID: <span className="font-mono text-gray-600">{order?.id || order?._id}</span>
    </p>

    {/* Items */}
    {order?.items?.length > 0 && (
      <div className="text-left bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Items Ordered</h3>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                <img src={item.image || 'https://placehold.co/80'} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Address */}
    {order?.address && (
      <div className="text-left bg-indigo-50 rounded-xl p-4 mb-6">
        <h3 className="text-sm font-semibold text-indigo-700 mb-2 flex items-center gap-1">
          <MapPin className="w-4 h-4" /> Delivering to
        </h3>
        <p className="text-sm text-gray-700 font-medium">{order.address.name}</p>
        <p className="text-sm text-gray-500">{order.address.street && `${order.address.street}, `}{order.address.city}, {order.address.state} – {order.address.pincode}</p>
        <p className="text-sm text-gray-500">📞 {order.address.phone}</p>
      </div>
    )}

    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Link
        to="/products"
        className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  </div>
);

// ─── Main Checkout Page ───────────────────────────────────────────────────────
const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep]             = useState(1);
  const [addressData, setAddressData] = useState(null);
  const [order, setOrder]           = useState(null);

  if (cartItems.length === 0 && step < 3) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link to="/products" className="text-indigo-600 font-semibold hover:underline">← Browse Products</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddressDone = (data) => {
    setAddressData(data);
    setStep(2);
  };

  const handlePaymentDone = async (orderData) => {
    setOrder(orderData);
    await clearCart();
    setStep(3);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => step === 1 ? navigate('/cart') : setStep(s => s - 1)}
            className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? 'Back to Cart' : 'Back'}
          </button>

          <Stepper current={step} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 1 && <AddressStep onNext={handleAddressDone} />}
              {step === 2 && (
                <PaymentStep
                  addressData={addressData}
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  onNext={handlePaymentDone}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && <ConfirmationStep order={order} />}
            </div>

            {/* Sidebar — hide on confirmation */}
            {step < 3 && (
              <div className="lg:col-span-1">
                <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
