import { getProductById } from '@/app/dashboard/admin/products/_lib/product.data'
import { notFound, redirect } from 'next/navigation'
import CheckoutSummary from './_components/CheckoutSummary'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

interface pageProps {
  params: Promise<{
    productId: string
  }>
}

export default async function page({ params }: pageProps) {
  const publicKey = process.env.MERCADOPAGO_PUBLIC_KEY as string

  const { productId } = await params

  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    redirect('/auth/signin') // Redirect to sign-in if no user is authenticated
  }

  const product = await getProductById(productId)

  if (!product) notFound()

  return (
    <>

      <CheckoutSummary product={product} userId={userId} publicKey={publicKey} />

    </>
  )
}
