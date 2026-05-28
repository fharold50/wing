/**
 * Wing icon set — Phosphor Duotone re-exports under Lucide-compatible names.
 *
 * Why a wrapper instead of importing Phosphor everywhere:
 *   1. Single switch-point if we ever change icon libraries again.
 *   2. Forces every icon to render at the same weight (duotone) so the brand
 *      stays consistent.
 *   3. Keeps call-sites identical to the old Lucide API: <Waves size={16} />
 *      etc., so the rest of the codebase doesn't have to refactor JSX.
 *
 * To add a new icon: pick one from https://phosphoricons.com and add it
 * below. Keep the export name matching the Lucide name when possible.
 */
import { forwardRef } from "react";
import type { ComponentType } from "react";
import {
  Airplane as PAirplane,
  AppleLogo as PAppleLogo,
  ArrowLeft as PArrowLeft,
  Barbell as PBarbell,
  BellRinging as PBellRinging,
  Calendar as PCalendar,
  Camera as PCamera,
  Car as PCar,
  ChatCircle as PChatCircle,
  Check as PCheck,
  Coffee as PCoffee,
  Compass as PCompass,
  Cpu as PCpu,
  DeviceMobile as PDeviceMobile,
  DiceFive as PDiceFive,
  Feather as PFeather,
  Flag as PFlag,
  ForkKnife as PForkKnife,
  GlobeHemisphereWest as PGlobe,
  Heart as PHeart,
  House as PHouse,
  MapPin as PMapPin,
  MapTrifold as PMapTrifold,
  MaskHappy as PMaskHappy,
  Mountains as PMountains,
  MusicNote as PMusicNote,
  PaperPlaneTilt as PPaperPlaneTilt,
  Plus as PPlus,
  SealCheck as PSealCheck,
  Shield as PShield,
  ShieldCheck as PShieldCheck,
  Sparkle as PSparkle,
  Star as PStar,
  Sun as PSun,
  Target as PTarget,
  Tray as PTray,
  User as PUser,
  Users as PUsers,
  Waves as PWaves,
  Wine as PWine,
  X as PX,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react/dist/ssr";

type WingIconProps = Omit<IconProps, "weight"> & {
  /** Override the duotone weight if you really need a different look. */
  weight?: IconProps["weight"];
};

function makeIcon(Inner: ComponentType<IconProps>, name: string): ComponentType<WingIconProps> {
  const Component = forwardRef<SVGSVGElement, WingIconProps>(function WingIcon(
    { weight = "duotone", ...rest },
    ref,
  ) {
    return <Inner ref={ref} weight={weight} {...rest} />;
  });
  Component.displayName = `Wing(${name})`;
  return Component as ComponentType<WingIconProps>;
}

// Lucide-style names → Phosphor icons (defaulting to duotone weight).
export const Airplane = makeIcon(PAirplane, "Airplane");
export const Plane = Airplane;

export const Apple = makeIcon(PAppleLogo, "Apple");
export const AppleLogo = Apple;

export const ArrowLeft = makeIcon(PArrowLeft, "ArrowLeft");

export const Barbell = makeIcon(PBarbell, "Barbell");
export const Dumbbell = Barbell;

export const Bell = makeIcon(PBellRinging, "Bell");

export const Calendar = makeIcon(PCalendar, "Calendar");
export const Camera = makeIcon(PCamera, "Camera");
export const Car = makeIcon(PCar, "Car");
export const ChatCircle = makeIcon(PChatCircle, "ChatCircle");
export const MessageCircle = ChatCircle;

export const Check = makeIcon(PCheck, "Check");
export const Coffee = makeIcon(PCoffee, "Coffee");
export const Compass = makeIcon(PCompass, "Compass");
export const Cpu = makeIcon(PCpu, "Cpu");

export const DeviceMobile = makeIcon(PDeviceMobile, "DeviceMobile");
export const Smartphone = DeviceMobile;

export const DiceFive = makeIcon(PDiceFive, "DiceFive");
export const Dices = DiceFive;

export const Feather = makeIcon(PFeather, "Feather");
export const Flag = makeIcon(PFlag, "Flag");

export const ForkKnife = makeIcon(PForkKnife, "ForkKnife");
export const UtensilsCrossed = ForkKnife;

export const Globe = makeIcon(PGlobe, "Globe");
export const Heart = makeIcon(PHeart, "Heart");
export const Home = makeIcon(PHouse, "Home");
export const MapPin = makeIcon(PMapPin, "MapPin");

export const MapTrifold = makeIcon(PMapTrifold, "MapTrifold");
export const Map = MapTrifold;

export const MaskHappy = makeIcon(PMaskHappy, "MaskHappy");
export const Theater = MaskHappy;

export const Mountains = makeIcon(PMountains, "Mountains");
export const Mountain = Mountains;

export const MusicNote = makeIcon(PMusicNote, "MusicNote");
export const Music = MusicNote;

export const PaperPlaneTilt = makeIcon(PPaperPlaneTilt, "PaperPlaneTilt");
export const Send = PaperPlaneTilt;
export const Play = PaperPlaneTilt; // legacy; not currently used at any call-site

export const Plus = makeIcon(PPlus, "Plus");

export const SealCheck = makeIcon(PSealCheck, "SealCheck");
export const BadgeCheck = SealCheck;

export const Shield = makeIcon(PShield, "Shield");
export const ShieldCheck = makeIcon(PShieldCheck, "ShieldCheck");

export const Sparkle = makeIcon(PSparkle, "Sparkle");
export const Sparkles = Sparkle;

export const Star = makeIcon(PStar, "Star");
export const Sun = makeIcon(PSun, "Sun");
export const Target = makeIcon(PTarget, "Target");

export const Tray = makeIcon(PTray, "Tray");
export const Inbox = Tray;

export const User = makeIcon(PUser, "User");
export const Users = makeIcon(PUsers, "Users");

export const Waves = makeIcon(PWaves, "Waves");
export const Wine = makeIcon(PWine, "Wine");
export const X = makeIcon(PX, "X");
