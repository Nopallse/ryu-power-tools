import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface ProductCategoryRedirectProps {
  params: Promise<{
    slugs?: string[];
  }>;
}

const DEFAULT_LANG = "en";

export default async function ProductCategoryRedirect({
  params,
}: ProductCategoryRedirectProps) {
  const { slugs } = await params;
  const slugPath = slugs?.join("/") ?? "";

  redirect(`/${DEFAULT_LANG}/product-category/${slugPath}`);
}
