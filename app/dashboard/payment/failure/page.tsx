import Link from 'next/link';

const PaymentFailurePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md">
        <svg
          className="w-24 h-24 text-red-500 mx-auto mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h1 className="text-3xl font-bold text-red-700 mb-4">¡Pago Fallido!</h1>
        <p className="text-gray-700 mb-6">
          Hubo un problema al procesar tu pago. Por favor, inténtalo de nuevo o contacta a soporte.
        </p>
        <Link href="/dashboard/precios">
          <p className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out mr-4">
            Reintentar Pago
          </p>
        </Link>
        <Link href="/dashboard">
          <p className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out">
            Volver al Dashboard
          </p>
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
