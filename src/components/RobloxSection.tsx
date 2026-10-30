import { ArtSlot } from '@/components/ui/art-slot';

export function RobloxSection() {
  return (
    <section id="games" className="roblox">
      <ArtSlot
        className="roblox__character art-slot--cut"
        src="/images/roblox/character.png"
        alt="My Roblox character"
        sizes="(max-width: 680px) 85vw, 45vw"
      />

      <h2 className="roblox__phrase">
        i also make games!{' '}
        <span className="roblox__note">(roblox, luau lang)</span>
      </h2>
    </section>
  );
}
