import React, { useState, useEffect } from 'react';
import { Plus, Home, Briefcase, MapPin, Edit2, Trash2, Check, ShieldCheck, Phone, Building, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export interface Address {
  id: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
  fullName: string;
  street: string;
  apartment: string;
  cityStateZip: string;
  country: string;
  phone: string;
}

interface AddressBookViewProps {
  currentUser?: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
}

export const AddressBookView: React.FC<AddressBookViewProps> = ({ currentUser }) => {
  const userKey = currentUser?.email ? `luxe_addresses_${currentUser.email}` : 'luxe_addresses_guest';

  // INITIALIZE WITH EMPTY ARRAY BY DEFAULT (NO MOCK DATA)
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(userKey);
        if (saved) return JSON.parse(saved);
      }
    } catch {}
    return [];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [cityStateZip, setCityStateZip] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [type, setType] = useState<'home' | 'work' | 'other'>('home');

  // Save addresses to user's isolated local storage whenever changed
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(userKey, JSON.stringify(addresses));
      }
    } catch {}
  }, [addresses, userKey]);

  const handleSetDefault = (id: string) => {
    setAddresses(prev =>
      prev.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
    );
    toast.success('Default address updated!');
  };

  const handleRemove = (id: string) => {
    if (!confirm('Are you sure you want to remove this address?')) return;
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.success('Address removed successfully!');
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingId(addr.id);
    setFullName(addr.fullName);
    setStreet(addr.street);
    setApartment(addr.apartment);
    setCityStateZip(addr.cityStateZip);
    setPhone(addr.phone);
    setType(addr.type);
    setIsAdding(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !street.trim()) {
      toast.error('Please enter full name and street address.');
      return;
    }

    if (editingId) {
      // Update existing address
      setAddresses(prev =>
        prev.map(a =>
          a.id === editingId
            ? {
                ...a,
                fullName,
                street,
                apartment: apartment || 'N/A',
                cityStateZip: cityStateZip || 'Delhi, 110053',
                phone: phone || '8790876543',
                type
              }
            : a
        )
      );
    } else {
      // Add new address
      const newAddr: Address = {
        id: 'addr-' + Date.now(),
        isDefault: addresses.length === 0,
        type,
        fullName,
        street,
        apartment: apartment || 'N/A',
        cityStateZip: cityStateZip || 'Delhi, 110053',
        country: 'India',
        phone: phone || '8790876543'
      };
      setAddresses(prev => [...prev, newAddr]);
    }

    toast.success('Address saved successfully!');
    setIsAdding(false);
    setEditingId(null);
    setFullName('');
    setStreet('');
    setApartment('');
    setCityStateZip('');
    setPhone('');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 w-full space-y-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/5 dark:border-white/5 pb-8">
        <div className="space-y-2">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">PROFILE & SETTINGS</p>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-[#1c1b1b] dark:text-white">Your Saved Addresses</h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-xl">
            Isolated delivery address book for <span className="font-bold text-blue-600">{currentUser?.email || 'Your Account'}</span>.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setFullName(currentUser?.name || '');
            setStreet('');
            setApartment('');
            setCityStateZip('');
            setPhone(currentUser?.phone || '');
            setIsAdding(true);
          }}
          className="px-6 py-3.5 bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs rounded-2xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Address</span>
        </button>
      </div>

      {/* ADD / EDIT ADDRESS FORM */}
      {isAdding && (
        <form onSubmit={handleSaveAddress} className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
            <h3 className="font-serif text-lg font-bold text-black dark:text-white">
              {editingId ? 'Edit Address' : 'Add New Delivery Address'}
            </h3>
            <button type="button" onClick={() => setIsAdding(false)} className="p-1 text-gray-400 hover:text-black dark:hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Customer Name"
                className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="10-digit Mobile Number"
                className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">Flat / House No / Building Name *</label>
              <input
                type="text"
                value={street}
                onChange={e => setStreet(e.target.value)}
                placeholder="e.g. H.No. 222, Building 1, Gali No. 6"
                className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">Area / Locality / Street</label>
              <input
                type="text"
                value={apartment}
                onChange={e => setApartment(e.target.value)}
                placeholder="e.g. Maujpur, Adarsh Mohalla"
                className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">City, State & Pincode</label>
              <input
                type="text"
                value={cityStateZip}
                onChange={e => setCityStateZip(e.target.value)}
                placeholder="e.g. Delhi, 110053"
                className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t dark:border-zinc-800">
            <div className="flex gap-3">
              {(['home', 'work', 'other'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border cursor-pointer ${
                    type === t
                      ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                      : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer">
                Save Address
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2.5 border text-xs font-bold rounded-xl cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* SAVED ADDRESS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map(addr => (
          <div
            key={addr.id}
            className={`bg-white dark:bg-zinc-900 border rounded-3xl p-6 space-y-4 shadow-sm relative transition-all ${
              addr.isDefault ? 'border-amber-500 dark:border-amber-400' : 'border-black/10 dark:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {addr.type === 'work' ? <Briefcase className="w-4 h-4 text-amber-500" /> : <Home className="w-4 h-4 text-blue-500" />}
                <span className="font-bold text-xs uppercase tracking-wider">{addr.type} Address</span>
              </div>
              {addr.isDefault ? (
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-bold uppercase">
                  Default Address
                </span>
              ) : (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  Make Default
                </button>
              )}
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-bold text-sm text-black dark:text-white">{addr.fullName}</p>
              <p className="text-gray-600 dark:text-gray-300">{addr.street}, {addr.apartment}</p>
              <p className="text-gray-600 dark:text-gray-300">{addr.cityStateZip}</p>
              <p className="text-gray-500 font-mono pt-1">Phone: {addr.phone}</p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-black/5 dark:border-white/5">
              <button onClick={() => handleOpenEdit(addr)} className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1 cursor-pointer">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => handleRemove(addr.id)} className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}

        {addresses.length === 0 && !isAdding && (
          <div className="md:col-span-2 py-12 text-center bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-800 space-y-3">
            <MapPin className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="font-serif text-base font-bold">No Saved Addresses Found</p>
            <p className="text-xs text-gray-500">Your address book is currently empty. Click "+ Add New Address" above to save delivery locations.</p>
          </div>
        )}
      </div>
    </div>
  );
};
