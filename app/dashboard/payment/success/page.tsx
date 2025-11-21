import Link from 'next/link';

const PaymentSuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md">
        <svg
          className="w-24 h-24 text-green-500 mx-auto mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h1 className="text-3xl font-bold text-green-700 mb-4">¡Pago Exitoso!</h1>
        <p className="text-gray-700 mb-6">
          Tu transacción se ha completado con éxito. Gracias por tu compra.
        </p>
        <Link href="/dashboard">
          <p className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out">
            Volver al Dashboard
          </p>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
