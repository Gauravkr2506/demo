"use client";

import { Phone } from "./phone";
import { ProfileView } from "./profile-view";
import { QRCode } from "./qr-code";
import { EXAMPLE_PROFILES } from "@/lib/demo-data";
import { useOrigin } from "@/lib/use-origin";

/** Secondary hero device with the floating scan card, used on /examples. */
export function HeroDevice({ profileId = "ex_social" }: { profileId?: string }) {
  const profile = EXAMPLE_PROFILES.find((p) => p.id === profileId) ?? EXAMPLE_PROFILES[0];
  const origin = useOrigin();

  return (
    <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
      <div style={{ position: "relative" }}>
        <Phone width={262} statusOnImage lightHome>
          <ProfileView profile={profile} interactive={false} />
        </Phone>

        <div
          className="hide-mobile"
          style={{ position: "absolute", right: -96, bottom: 48, textAlign: "center" }}
        >
          <div style={{ background: "#fff", padding: 9, borderRadius: 13, boxShadow: "var(--sh-lg)" }}>
            <QRCode value={`${origin}/p/${profile.slug}`} size={104} />
            <div className="qr-scan-label" style={{ marginTop: 5 }}>SCAN ME</div>
          </div>
        </div>

        <p
          className="scribble hide-mobile"
          style={{ position: "absolute", left: -118, top: 60, width: 130, textAlign: "right" }}
        >
          Same QR code.
          <br />
          Different profiles.
          <br />
          You choose.
        </p>
      </div>
    </div>
  );
}
