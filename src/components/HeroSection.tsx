import { ContactList } from '@/components/ui/contact-list';
import { contacts } from '@/data/social';

export function HeroSection() {
  return (
    <section className="hero">
      <ContactList contacts={contacts} />
      <h1 className="hero__phrase">work on the same vibe ;)</h1>
    </section>
  );
}
