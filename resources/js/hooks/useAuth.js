import { usePage } from "@inertiajs/react";

export default function useAuth() {
  const { props } = usePage();
  return props.auth?.user || null;
}
