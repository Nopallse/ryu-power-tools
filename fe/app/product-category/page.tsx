import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const DEFAULT_LANG = "en";

export default function ProductCategoryIndexRedirect() {
  redirect(`/${DEFAULT_LANG}/product-category`);
}
