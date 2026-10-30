import { CloudShader } from '@/components/ui/cloud-shader';
import { ContactList } from '@/components/ui/contact-list';
import { contacts } from '@/data/social';

export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__sky" aria-hidden="true">
        <CloudShader />
      </div>

      <ContactList contacts={contacts} />
      <h1 className="hero__phrase">work on the same vibe ;)</h1>
    </section>
  );
}
