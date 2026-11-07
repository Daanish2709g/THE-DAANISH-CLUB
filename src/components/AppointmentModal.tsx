import React, { useState } from 'react';
import { OccasionType, AtelierAppointment } from '../types/suit';
import { X, Calendar, Video, MapPin, Clock, CheckCircle2, PackageCheck, Sparkles } from 'lucide-react';

interface AppointmentModalProps {
  onClose: () => void;
  onConfirmAppointment: (appointment: AtelierAppointment) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  onClose,
  onConfirmAppointment,
}) => {
  const [consultType, setConsultType] = useState<'in-person' | 'virtual'>('in-person');
  const [selectedAtelier, setSelectedAtelier] = useState('Savile Row Atelier · 14 Savile Row, Mayfair, London');
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>('black-tie');
  const [appointmentDate, setAppointmentDate] = useState('2026-11-14');
  const [appointmentTime, setAppointmentTime] = useState('14:30');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [requestSwatchKit, setRequestSwatchKit] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedId, setConfirmedId] = useState('');

  const ateliers = [
    { id: 'london', name: 'Savile Row Atelier · 14 Savile Row, Mayfair, London' },
    { id: 'milan', name: 'Milanese Chamber · Via Monte Napoleone 8, Milan' },
    { id: 'newyork', name: 'Madison Flagship · 740 Madison Avenue, New York' },
    { id: 'tokyo', name: 'Ginza Salon · 6-10-1 Ginza, Chuo City, Tokyo' },
    { id: 'mumbai', name: 'The Taj Suite · Colaba Heritage Wing, Mumbai' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const id = `APT-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedId(id);

    const appt: AtelierAppointment = {
      id,
      type: consultType,
      locationName: consultType === 'in-person' ? selectedAtelier : 'Virtual Bespoke High-Definition Video Salon',
      date: appointmentDate,
      timeSlot: appointmentTime,
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      occasionInterest: selectedOccasion,
      notes,
      requestFabricSwatchKit: requestSwatchKit,
      createdAt: new Date().toISOString(),
    };

    onConfirmAppointment(appt);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0F0F14] border border-[#272730] rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222228] flex items-center justify-between bg-[#121218]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A880]" />
            <div>
              <h2 className="text-lg font-serif text-[#F3F4F6]">
                Private Atelier Consultation
              </h2>
              <p className="text-xs text-[#9CA3AF]">
                One-on-One Bespoke Master Tailor & Virtual Stylist Appointment
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1C1C24] rounded-lg transition-colors"
            aria-label="Close appointment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#C5A880]/15 border border-[#C5A880] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#C5A880]" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#C5A880] block font-semibold mb-1">
                Commission Confirmed · {confirmedId}
              </span>
              <h3 className="text-2xl font-serif text-[#F3F4F6]">
                Your Private Fitting Is Reserved
              </h3>
              <p className="text-xs text-[#9CA3AF] max-w-md mx-auto mt-2 leading-relaxed">
                A calendar invitation and private styling dossier have been dispatched to <span className="text-[#E5E7EB] font-medium">{email}</span>.
              </p>
            </div>

            <div className="bg-[#14141A] border border-[#22222A] rounded-xl p-5 text-left text-xs max-w-md mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Format:</span>
                <span className="text-[#F3F4F6] font-medium capitalize">{consultType} Consultation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Date & Time:</span>
                <span className="text-[#F3F4F6] font-medium">{appointmentDate} at {appointmentTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Location:</span>
                <span className="text-[#F3F4F6] font-medium truncate max-w-[220px]">
                  {consultType === 'in-person' ? selectedAtelier.split('·')[0] : 'Private Video Link'}
                </span>
              </div>
              {requestSwatchKit && (
                <div className="pt-2 border-t border-[#22222A] flex items-center gap-2 text-[#C5A880]">
                  <PackageCheck className="w-4 h-4" />
                  <span>Complimentary Swatch Sample Kit will be dispatched to your address.</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-[#C5A880] hover:bg-[#D4AF37] text-[#0A0A0C] text-xs font-semibold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
            >
              Return to Atelier
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Type selector: In-Person vs Virtual */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConsultType('in-person')}
                className={`p-3.5 rounded-lg border text-left transition-all flex items-center gap-3 ${
                  consultType === 'in-person'
                    ? 'border-[#C5A880] bg-[#1A1A22] text-[#F3F4F6]'
                    : 'border-[#22222A] bg-[#121216] text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                <MapPin className="w-5 h-5 text-[#C5A880] shrink-0" />
                <div>
                  <div className="text-xs font-semibold">Flagship Atelier</div>
                  <div className="text-[10px] text-[#9CA3AF]">In-Person Fitting Suite</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConsultType('virtual')}
                className={`p-3.5 rounded-lg border text-left transition-all flex items-center gap-3 ${
                  consultType === 'virtual'
                    ? 'border-[#C5A880] bg-[#1A1A22] text-[#F3F4F6]'
                    : 'border-[#22222A] bg-[#121216] text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                <Video className="w-5 h-5 text-[#C5A880] shrink-0" />
                <div>
                  <div className="text-xs font-semibold">Virtual Video Salon</div>
                  <div className="text-[10px] text-[#9CA3AF]">Live 1-on-1 Stylist Call</div>
                </div>
              </button>
            </div>

            {/* In-Person Atelier selector */}
            {consultType === 'in-person' && (
              <div>
                <label className="text-xs uppercase tracking-wider text-[#9CA3AF] block mb-2 font-medium">
                  Select Atelier Location
                </label>
                <select
                  value={selectedAtelier}
                  onChange={(e) => setSelectedAtelier(e.target.value)}
                  aria-label="Select Atelier Location"
                  className="w-full bg-[#141418] border border-[#272730] text-[#E5E7EB] text-xs p-3 rounded-lg focus:outline-none focus:border-[#C5A880]"
                >
                  {ateliers.map((atl) => (
                    <option key={atl.id} value={atl.name}>
                      {atl.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Occasion & Date / Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#9CA3AF] block mb-1.5 font-medium">
                  Occasion
                </label>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value as OccasionType)}
                  aria-label="Occasion"
                  className="w-full bg-[#141418] border border-[#272730] text-[#E5E7EB] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="black-tie">Black Tie & Gala</option>
                  <option value="bridal-wedding">Haute Bridal & Wedding</option>
                  <option value="executive">Executive Boardroom</option>
                  <option value="all">Comprehensive Wardrobe</option>
                </select>
              </div>

              <div>
                <label htmlFor="preferred-date" className="text-xs uppercase tracking-wider text-[#9CA3AF] block mb-1.5 font-medium">
                  Preferred Date
                </label>
                <input
                  id="preferred-date"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full bg-[#141418] border border-[#272730] text-[#E5E7EB] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#9CA3AF] block mb-1.5 font-medium">
                  Time Slot
                </label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  aria-label="Time Slot"
                  className="w-full bg-[#141418] border border-[#272730] text-[#E5E7EB] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="11:00">11:00 AM</option>
                  <option value="14:30">02:30 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="18:30">06:30 PM (Private Evening)</option>
                </select>
              </div>
            </div>

            {/* Client Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="client-full-name" className="text-xs uppercase tracking-wider text-[#9CA3AF] block mb-1 font-medium">
                  Full Name *
                </label>
                <input
                  id="client-full-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alistair Sterling"
                  className="w-full bg-[#141418] border border-[#272730] text-[#F3F4F6] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label htmlFor="client-email-address" className="text-xs uppercase tracking-wider text-[#9CA3AF] block mb-1 font-medium">
                  Email Address *
                </label>
                <input
                  id="client-email-address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@luxury.com"
                  className="w-full bg-[#141418] border border-[#272730] text-[#F3F4F6] text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            {/* Fabric Swatch Kit delivery checkbox */}
            <label className="flex items-start gap-3 p-3 bg-[#14141A] rounded-lg border border-[#24242E] cursor-pointer">
              <input
                type="checkbox"
                checked={requestSwatchKit}
                onChange={(e) => setRequestSwatchKit(e.target.checked)}
                className="mt-0.5 accent-[#C5A880] w-4 h-4 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-semibold text-[#F3F4F6] block">
                  Deliver Complimentary Fabric Swatch Box
                </span>
                <span className="text-[#9CA3AF]">
                  Receive physical cuttings of Loro Piana Tasmanian wools and Scabal cloths before your session.
                </span>
              </div>
            </label>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A0A0C] bg-[#C5A880] hover:bg-[#D4AF37] rounded-lg transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirm Appointment Reservation</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
