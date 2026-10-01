import { notFound } from 'next/navigation';
import { getPropertyById } from '@/lib/server/property';
import { PropertyDetails } from '@/types/property';
import { Logo } from '@/components/layout/Logo';
import { format } from 'date-fns';
import { BookingCard } from '@/components/properties/booking/BookingCard';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const propertyId = typeof resolvedParams.propertyId === 'string' ? resolvedParams.propertyId : undefined;
  const confirmationCode = typeof resolvedParams.confirmationCode === 'string' ? resolvedParams.confirmationCode : undefined;
  const firstName = typeof resolvedParams.firstName === 'string' ? resolvedParams.firstName : 'Guest';
  const email = typeof resolvedParams.email === 'string' ? resolvedParams.email : 'your email address';

  if (!propertyId || !confirmationCode) {
    // Basic fallback if params are missing
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FEF6EE]">
        <h1 className="text-2xl font-serif mb-4">Booking Confirmed!</h1>
        <p>Your confirmation code is: {confirmationCode || 'Unknown'}</p>
      </div>
    );
  }

  let property: PropertyDetails | null = null;
  try {
    const res = await getPropertyById<PropertyDetails>(propertyId);
    if (res?.data) {
      property = res.data;
    }
  } catch (error) {
    console.error('Failed to fetch property details for success page:', error);
  }

  if (!property) {
    notFound();
  }

  let siteSettings: any = null;
  let homepage: any = null;
  try {
    const { editorialService } = await import('@/services/about.service');
    const settingsReq = await editorialService.getSiteSettings();
    if (settingsReq?.success) {
      siteSettings = settingsReq.data;
    }
    const { getHomepage } = await import('@/lib/server/homepage');
    homepage = await getHomepage();
  } catch (err) {
    console.error('Failed to fetch site settings:', err);
  }

  const checkInDate = typeof resolvedParams.checkIn === 'string' ? new Date(resolvedParams.checkIn) : null;
  const checkOutDate = typeof resolvedParams.checkOut === 'string' ? new Date(resolvedParams.checkOut) : null;
  
  const checkInFormatted = checkInDate ? format(checkInDate, "EEE d MMM, 'from 3pm'") : '';
  const checkOutFormatted = checkOutDate ? format(checkOutDate, "EEE d MMM, 'by 10am'") : '';

  const adults = typeof resolvedParams.adults === 'string' ? parseInt(resolvedParams.adults) : 1;
  const children = typeof resolvedParams.children === 'string' ? parseInt(resolvedParams.children) : 0;
  const totalGuests = adults + children;

  return (
    <div className="flex flex-col min-h-screen bg-[#FEF6EE] font-sans text-[#1B1A17]">
      {/* Header */}
      <header className="w-full pt-8 pb-8">
        <div className="flex justify-center">
          <Logo image={siteSettings?.logo} className="text-[#1B1A17]" isLink={true} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-[188px] pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_345px] gap-12 lg:gap-[187.5px]">
          
          {/* Left Column */}
          <div className="flex flex-col pt-10">
            <div className="mb-12">
              <span className="text-[#7D7975] text-sm mb-2 block">Booking confirmed</span>
              <h1 className="font-serif text-[40px] leading-tight mb-4">
                See you in {property.location?.city || property.title}, {firstName}.
              </h1>
              <p className="text-[#7D7975] text-sm mb-4 tracking-wide uppercase">
                REF: {confirmationCode}
              </p>
              <div className="text-sm text-[#7D7975] space-y-1">
                <p>A confirmation is on its way to {email}.</p>
                <p>The smart-lock entry code follows by email 48 hours before check-in.</p>
              </div>
            </div>

            <div className="bg-[#E1DBC3] rounded-lg p-6 flex flex-col gap-4 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-[#7D7975]">Check-in</span>
                <span className="text-right font-medium">{checkInFormatted}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-[#7D7975]">Check-out</span>
                <span className="text-right font-medium">{checkOutFormatted}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-[#7D7975]">Guests</span>
                <span className="text-right font-medium">{totalGuests} {totalGuests === 1 ? 'adult' : 'adults'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-[#7D7975]">Address</span>
                <span className="text-right font-medium">Shared with the entry code</span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-8 text-sm">
              <button className="text-[#7D7975] hover:text-[#1B1A17] transition-colors">Add to calendar</button>
              <a href={`/locations/${(property.location as any)?.slug || ''}`} className="text-[#7D7975] hover:text-[#1B1A17] transition-colors flex items-center gap-1">
                Things to do in {property.location?.city || 'the area'} <span className="text-lg leading-none">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <BookingCard 
              listingId={property.guestyId || property.id}
              isCheckout={true}
              hideSubmit={true} 
              hideMobileSticky={true}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#1B1A17] text-white py-8 mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] flex flex-col md:flex-row justify-between items-center text-xs">
          <div className="flex items-center gap-4 text-white/50">
            <span>Stay with Miio. All rights reserved.</span>
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms</a>
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy</a>
          </div>
          
          <div className="mt-6 md:mt-0 opacity-50 flex items-center justify-center">
            {/* The PaymentLogos component can be included here if needed, or we can just render the logos */}
            <div className="flex items-center gap-2">
              <span className="mr-2">SECURE PAYMENT</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
