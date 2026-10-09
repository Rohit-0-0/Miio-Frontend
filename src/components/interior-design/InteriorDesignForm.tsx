'use client';

import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { apiClient } from '@/lib/api/client';

type Step = 1 | 2 | 3;

export function InteriorDesignForm() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyLocation: '',
    propertyType: '',
    propertyUsage: '',
    services: [] as string[],
    propertySize: '',
    propertyStage: '',
    budget: '',
    timeline: '',
    details: '',
    hearAboutUs: '',
    floorplanUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleNext = () => setStep((s) => Math.min(s + 1, 3) as Step);
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1) as Step);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNext();
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await apiClient.post<any>('/enquiry', formData);
      
      if (response.success) {
        setIsSuccess(true);
      } else {
        alert(response.error || 'Failed to submit. Please try again.');
      }
    } catch (e) {
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateForm = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleService = (service: string) => {
    setFormData(prev => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists 
          ? prev.services.filter(s => s !== service)
          : [...prev.services, service]
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      
      if (data.url) {
        updateForm('floorplanUrl', data.url);
      } else {
        alert(data.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-[#2C241F] p-12 text-center border border-[#FEF6EE]/10 rounded-xl max-w-2xl mx-auto">
        <h3 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">Your project sounds exciting.</h3>
        <p className="opacity-80 mb-10 text-lg">
          Thanks for telling us a little about your property. The next step is a short discovery call so we can understand the project in more detail and recommend the right approach.
        </p>
        <a 
          href="https://calendly.com/miio/discovery-call" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#FEF6EE] text-[#241D19] px-8 py-4 uppercase text-sm tracking-widest hover:bg-white transition-colors inline-block font-semibold"
        >
          BOOK YOUR DISCOVERY CALL →
        </a>
      </div>
    );
  }

  return (
    <div id="enquiry-form" className="bg-[#2C241F] p-8 md:p-16 w-full text-[#FEF6EE] border border-[#FEF6EE]/10 rounded-xl shadow-2xl">
      <div className="mb-12">
        <p className="text-sm tracking-widest uppercase mb-4 opacity-50">
          Step 0{step} — {step === 1 ? 'Your property' : step === 2 ? 'Your project' : 'Final details'}
        </p>
        <div className="w-full h-[1px] bg-[#FEF6EE]/20 relative">
          <div 
            className="absolute top-0 left-0 h-[2px] bg-[#FEF6EE] transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-serif mb-8">Tell us about your property.</h3>
            <p className="opacity-80 mb-8 text-sm">Whether you're starting with an empty space or rethinking an existing property, tell us a little about the project and we'll be in touch to arrange a discovery call.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-widest opacity-80">First Name*</label>
                <input 
                  required
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => updateForm('firstName', e.target.value)}
                  className="bg-transparent border-b border-[#FEF6EE]/20 py-3 outline-none focus:border-[#FEF6EE] transition-colors placeholder-[#FEF6EE]/30"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-widest opacity-80">Last Name*</label>
                <input 
                  required
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => updateForm('lastName', e.target.value)}
                  className="bg-transparent border-b border-[#FEF6EE]/20 py-3 outline-none focus:border-[#FEF6EE] transition-colors placeholder-[#FEF6EE]/30"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold uppercase tracking-widest opacity-80">Email Address*</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  className="bg-transparent border-b border-[#FEF6EE]/20 py-3 outline-none focus:border-[#FEF6EE] transition-colors placeholder-[#FEF6EE]/30"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold uppercase tracking-widest opacity-80">Phone Number</label>
                <div className="border-b border-[#FEF6EE]/20 focus-within:border-[#FEF6EE] transition-colors pb-1 pt-2 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:text-[#FEF6EE] [&_.PhoneInputInput]:placeholder-[#FEF6EE]/30 [&_.PhoneInputCountryIcon--border]:border-none [&_.PhoneInputCountryIcon]:!shadow-none [&_.PhoneInputCountrySelectArrow]:opacity-50">
                  <PhoneInput
                    international
                    defaultCountry="GB"
                    limitMaxLength={true}
                    value={formData.phone}
                    onChange={(val) => updateForm('phone', val || '')}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold uppercase tracking-widest opacity-80">Property Location* (City / postcode)</label>
                <input 
                  required
                  type="text" 
                  value={formData.propertyLocation}
                  onChange={(e) => updateForm('propertyLocation', e.target.value)}
                  className="bg-transparent border-b border-[#FEF6EE]/20 py-3 outline-none focus:border-[#FEF6EE] transition-colors placeholder-[#FEF6EE]/30"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-widest opacity-80">Property Type*</label>
                <select 
                  required
                  value={formData.propertyType}
                  onChange={(e) => updateForm('propertyType', e.target.value)}
                  className="bg-transparent border-b border-[#FEF6EE]/20 py-3 outline-none focus:border-[#FEF6EE] transition-colors appearance-none cursor-pointer [&>option]:bg-[#2C241F] [&>option]:text-[#FEF6EE]"
                >
                  <option value="" disabled>Select</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Multi-unit development">Multi-unit development</option>
                  <option value="Serviced accommodation">Serviced accommodation</option>
                  <option value="Hotel / hospitality">Hotel / hospitality</option>
                  <option value="Corporate / healthcare accommodation">Corporate / healthcare accommodation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-widest opacity-80">How will the property be used?*</label>
                <select 
                  required
                  value={formData.propertyUsage}
                  onChange={(e) => updateForm('propertyUsage', e.target.value)}
                  className="bg-transparent border-b border-[#FEF6EE]/20 py-3 outline-none focus:border-[#FEF6EE] transition-colors appearance-none cursor-pointer [&>option]:bg-[#2C241F] [&>option]:text-[#FEF6EE]"
                >
                  <option value="" disabled>Select</option>
                  <option value="Short-term rental / Airbnb">Short-term rental / Airbnb</option>
                  <option value="Serviced accommodation">Serviced accommodation</option>
                  <option value="Investment property">Investment property</option>
                  <option value="Corporate accommodation">Corporate accommodation</option>
                  <option value="Healthcare accommodation">Healthcare accommodation</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-serif mb-8">Your project.</h3>
            
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <label className="text-sm font-semibold uppercase tracking-widest opacity-80">What do you need help with?* (Select all that apply)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Interior design / concept',
                    'Property styling',
                    'Furniture sourcing & procurement',
                    'Turnkey fit-out',
                    'Installation & styling',
                    'Photography preparation',
                    'Not sure yet'
                  ].map((service) => (
                    <label key={service} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${formData.services.includes(service) ? 'bg-[#FEF6EE] border-[#FEF6EE]' : 'border-[#FEF6EE]/30 group-hover:border-[#FEF6EE]/60'}`}>
                        {formData.services.includes(service) && <div className="w-2.5 h-2.5 bg-[#2C241F]" />}
                      </div>
                      <span className="opacity-90 text-sm">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-widest opacity-80">Number of bedrooms / approximate property size</label>
                <input 
                  type="text" 
                  value={formData.propertySize}
                  onChange={(e) => updateForm('propertySize', e.target.value)}
                  className="bg-transparent border-b border-[#FEF6EE]/20 py-3 outline-none focus:border-[#FEF6EE] transition-colors placeholder-[#FEF6EE]/30"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-widest opacity-80">What stage is the property currently at?*</label>
                  <select 
                    required
                    value={formData.propertyStage}
                    onChange={(e) => updateForm('propertyStage', e.target.value)}
                    className="bg-transparent border-b border-[#FEF6EE]/20 py-3 outline-none focus:border-[#FEF6EE] transition-colors appearance-none cursor-pointer [&>option]:bg-[#2C241F] [&>option]:text-[#FEF6EE]"
                  >
                    <option value="" disabled>Select</option>
                    <option value="Empty / unfurnished">Empty / unfurnished</option>
                    <option value="Existing furniture — needs refreshing">Existing furniture — needs refreshing</option>
                    <option value="Renovating">Renovating</option>
                    <option value="Furniture already ordered">Furniture already ordered</option>
                    <option value="New development / pre-completion">New development / pre-completion</option>
                    <option value="Currently operating">Currently operating</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-widest opacity-80">Approximate project budget, including furniture?*</label>
                  <select 
                    required
                    value={formData.budget}
                    onChange={(e) => updateForm('budget', e.target.value)}
                    className="bg-transparent border-b border-[#FEF6EE]/20 py-3 outline-none focus:border-[#FEF6EE] transition-colors appearance-none cursor-pointer [&>option]:bg-[#2C241F] [&>option]:text-[#FEF6EE]"
                  >
                    <option value="" disabled>Select</option>
                    <option value="Under $5,000">Under $5,000</option>
                    <option value="$5,000–$10,000">$5,000–$10,000</option>
                    <option value="$10,000–$20,000">$10,000–$20,000</option>
                    <option value="$20,000-$40,000">$20,000-$40,000</option>
                    <option value="$40,000+">$40,000+</option>
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-widest opacity-80">When would you like the property completed?*</label>
                <input 
                  required
                  type="date" 
                  value={formData.timeline}
                  onChange={(e) => updateForm('timeline', e.target.value)}
                  className="bg-transparent border-b border-[#FEF6EE]/20 py-3 outline-none focus:border-[#FEF6EE] transition-colors placeholder-[#FEF6EE]/30 [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-widest opacity-80">Tell us about your project</label>
                <textarea 
                  value={formData.details}
                  onChange={(e) => updateForm('details', e.target.value)}
                  rows={4}
                  className="bg-transparent border-b border-[#FEF6EE]/20 py-3 outline-none focus:border-[#FEF6EE] transition-colors resize-none placeholder-[#FEF6EE]/30"
                  placeholder="Tell us a little about the property, what you'd like to change and what you're hoping to achieve."
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-widest opacity-80">Upload photos or floor plans</label>
                <div className="border border-dashed border-[#FEF6EE]/30 p-6 flex flex-col items-center justify-center text-center gap-2 hover:bg-[#FEF6EE]/5 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {isUploading ? (
                    <span className="opacity-80">Uploading...</span>
                  ) : formData.floorplanUrl ? (
                    <span className="text-[#FEF6EE] font-semibold">Files attached successfully ✓</span>
                  ) : (
                    <>
                      <span className="text-xl">📁</span>
                      <span className="opacity-80 text-sm">Click or drag files to upload</span>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-serif mb-8">Final details.</h3>
            <div className="grid grid-cols-1 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-widest opacity-80">How did you hear about Miio?</label>
                <select 
                  value={formData.hearAboutUs}
                  onChange={(e) => updateForm('hearAboutUs', e.target.value)}
                  className="bg-transparent border-b border-[#FEF6EE]/20 py-3 outline-none focus:border-[#FEF6EE] transition-colors appearance-none cursor-pointer [&>option]:bg-[#2C241F] [&>option]:text-[#FEF6EE]"
                >
                  <option value="" disabled>Select</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Google">Google</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Pinterest">Pinterest</option>
                  <option value="Miio website">Miio website</option>
                  <option value="Referral">Referral</option>
                  <option value="Existing Miio guest/client">Existing Miio guest/client</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-8 pt-8 border-t border-[#FEF6EE]/10">
          {step > 1 ? (
            <button 
              type="button" 
              onClick={handlePrev}
              className="uppercase tracking-widest text-sm border-b border-[#FEF6EE] pb-1 hover:opacity-70 transition-opacity"
            >
              ← Back
            </button>
          ) : <div />}

          <button 
            type="submit"
            disabled={isSubmitting || (step === 2 && formData.services.length === 0)}
            className="bg-[#FEF6EE] text-[#241D19] px-8 py-4 uppercase text-sm tracking-widest hover:bg-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : step === 3 ? 'SUBMIT YOUR PROJECT' : 'Next Step →'}
          </button>
        </div>
      </form>
    </div>
  );
}
