import React from 'react'
import ProductList from './_components/ProductList'
import { getProductsWithCharacteristics } from './_lib/product.data'
import { notFound } from 'next/navigation'

export default async function page() {

  const products = await getProductsWithCharacteristics()

  if(!products) notFound() 

  return (
    <>
      <ProductList products={products} />
    </>
  )
} 
