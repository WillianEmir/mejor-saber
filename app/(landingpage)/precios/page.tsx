import Precios from "@/app/(landingpage)/precios/_components/Precios";
import { getProductsWithCharacteristics } from "@/app/dashboard/admin/products/_lib/product.data";
import { notFound } from "next/navigation";

export default async function page() {

  const products = await getProductsWithCharacteristics();
  
  if(!products) notFound()

  return (
    <Precios products={products} /> 
  )
}
  