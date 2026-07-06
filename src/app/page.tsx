import { redirect } from "next/navigation";

// The app opens on the Generator. There is no landing page (per the brief).
export default function Home() {
  redirect("/generator");
}
