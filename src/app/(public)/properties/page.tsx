import { getServerProperties, getServerCategories } from "@/lib/api/server";
import { PropertyList } from "@/components/properties/property-list";
import { PropertyFilters } from "@/components/properties/property-filters";

export const metadata = {
  title: "Properties | RentNest",
  description: "Browse available properties",
};

export default async function PropertiesPage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  
  const query = new URLSearchParams();
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) query.append(key, Array.isArray(value) ? value[0] : value);
    });
  }
  
  if (!query.has("limit")) query.append("limit", "12");

  const [propertiesRes, categoriesRes] = await Promise.all([
    getServerProperties(query),
    getServerCategories(),
  ]);

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <PropertyFilters categories={categoriesRes.data || []} />
        </aside>
        
        <main className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Available Properties</h1>
          <PropertyList 
            properties={propertiesRes.data || []} 
            meta={propertiesRes.meta} 
          />
        </main>
      </div>
    </div>
  );
}
