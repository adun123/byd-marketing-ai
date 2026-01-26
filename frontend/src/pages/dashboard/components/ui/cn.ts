export default function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}
