'use client'

import React, { useState } from 'react';

const faqData = [
  {
    question: "¿Qué es Next.js?",
    answer: "Next.js es un framework de React de código abierto que permite el desarrollo de aplicaciones web con renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG)."
  },
  {
    question: "¿Por qué debería usar Next.js en mi proyecto?",
    answer: "Next.js ofrece grandes ventajas como un rendimiento mejorado, optimización de imágenes incorporada, enrutamiento del sistema de archivos, y una experiencia de desarrollo fluida."
  },
  {
    question: "¿Es Next.js bueno para el SEO?",
    answer: "Sí, Next.js es excelente para el SEO debido a sus capacidades de renderizado del lado del servidor, lo que permite que los motores de búsqueda rastreen y indexen el contenido de manera más efectiva."
  },
  {
    question: "¿Qué es Next.js?",
    answer: "Next.js es un framework de React de código abierto que permite el desarrollo de aplicaciones web con renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG)."
  },
  {
    question: "¿Por qué debería usar Next.js en mi proyecto?",
    answer: "Next.js ofrece grandes ventajas como un rendimiento mejorado, optimización de imágenes incorporada, enrutamiento del sistema de archivos, y una experiencia de desarrollo fluida."
  },
  {
    question: "¿Es Next.js bueno para el SEO?",
    answer: "Sí, Next.js es excelente para el SEO debido a sus capacidades de renderizado del lado del servidor, lo que permite que los motores de búsqueda rastreen y indexen el contenido de manera más efectiva."
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Preguntas Frecuentes</h2>
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg shadow-sm">
            <button
              className="flex justify-between items-center w-full p-4 text-left font-medium text-gray-800 focus:outline-none"
              onClick={() => toggleAnswer(index)}
            >
              <span>{item.question}</span>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {openIndex === index && (
              <div className="p-4 pt-0 text-gray-600 transition-all duration-300 ease-in-out">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;