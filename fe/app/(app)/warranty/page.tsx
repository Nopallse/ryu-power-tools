import React from 'react';

const WarrantyPage = () => {
  const items = [
    {
      key: '1',
      label: (
        <span className="text-xl font-bold text-[#2d5016]">
          GENSET WARRANTY INFORMATION
        </span>
      ),
      children: (
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <p className="font-semibold text-[#2d5016] mb-3">
              Warranty Service valid for 1 year from the date of purchase with the following conditions:
            </p>
            <ul className="list-none space-y-2 ml-4">
              <li>
                <span className="font-semibold">a.</span> Send the warranty card to PO. Box 4040 JKT 11040 within 14 days from the date of purchase.
              </li>
              <li>
                <span className="font-semibold">b.</span> 50% discount for 3 months for Electric Spare Part (AVR, Rotor and Stator Switch) one time the same replacement.
              </li>
            </ul>
          </div>

          <p>
            Warranty only applies if there is damage as a result of production/manufacture's error or material error in RYU GENSET based on inspection of RYU Authorized Service Center.
          </p>

          <div>
            <p className="font-semibold text-[#2d5016] mb-3">Warranty does not apply:</p>
            <ul className="list-none space-y-2 ml-4">
              <li>
                <span className="font-semibold">a.</span> Warranty card is still in a state of blank (empty), model and serial number does not match the actual items.
              </li>
              <li>
                <span className="font-semibold">b.</span> Warranty card is not completely filled out, no stamp/signature by the dealer/store and has not been received within 14 (fourteen) days by the RYU Authorized Service Center.
              </li>
              <li>
                <span className="font-semibold">c.</span> Damaged due to improper usage, not according to the manual instructions.
              </li>
              <li>
                <span className="font-semibold">d.</span> Damage caused by user negligence and natural disasters.
              </li>
              <li>
                <span className="font-semibold">e.</span> Opening/disassembling or repairing by anyone other than an RYU Authorized Service Center.
              </li>
              <li>
                <span className="font-semibold">f.</span> Change/modify, or use accessories that are not in accordance with the application.
              </li>
              <li>
                <span className="font-semibold">g.</span> Wearing non-original parts or modified parts.
              </li>
              <li>
                <span className="font-semibold">h.</span> Warranty does not include replacement accessories, battery and oil.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span className="text-xl font-bold text-[#2d5016]">
          POWERTOOLS WARRANTY INFORMATION
        </span>
      ),
      children: (
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <p className="font-semibold text-[#2d5016] mb-3">TERMS OF WARRANTY</p>
            <p className="mb-3">Warranty applies with the following conditions:</p>
            <ul className="list-none space-y-2 ml-4">
              <li>
                <span className="font-semibold">a.</span> Send the warranty card to PO. Box 4040 JKT 11040 within 14 days from the date of purchase.
              </li>
              <li>
                <span className="font-semibold">b.</span> Warranty for 6 (six) months from the date of purchase in the form of spare part replacement (one-time reparation).
              </li>
              <li>
                <span className="font-semibold">c.</span> 40% discount of the same spare part for one-time repair (during the warranty period).
              </li>
              <li>
                <span className="font-semibold">d.</span> Lifetime warranty service.
              </li>
            </ul>
          </div>

          <p>
            Warranty only applies if there is damage as a result of production/manufacture's error or material error in RYU POWERTOOLS based on inspection of RYU Authorized Service Center.
          </p>

          <div>
            <p className="font-semibold text-[#2d5016] mb-3">Warranty does not apply:</p>
            <ul className="list-none space-y-2 ml-4">
              <li>
                <span className="font-semibold">a.</span> Warranty card is still in a state of blank (empty), model and serial number does not match the actual items.
              </li>
              <li>
                <span className="font-semibold">b.</span> Warranty card is not completely filled out, no stamp/signature by the dealer/store and has not been received within 14 (fourteen) days by the RYU Authorized Service Center.
              </li>
              <li>
                <span className="font-semibold">c.</span> Damaged due to improper usage, not according to the manual instructions.
              </li>
              <li>
                <span className="font-semibold">d.</span> Damage caused by user negligence and natural disasters.
              </li>
              <li>
                <span className="font-semibold">e.</span> Opening/disassembling or repairing by anyone other than an RYU Authorized Service Center.
              </li>
              <li>
                <span className="font-semibold">f.</span> Change/modify, or use accessories that are not in accordance with the application.
              </li>
              <li>
                <span className="font-semibold">g.</span> Wearing non-original parts or modified parts.
              </li>
              <li>
                <span className="font-semibold">h.</span> Warranty does not apply for spare parts: Carbon Brush, Power Cable, Drill Chuck, Battery, and Accessories.
              </li>
            </ul>
          </div>

          <p className="font-semibold">
            RYU Authorized Service Center reserves the right to decide and determine to accept or reject the claim without any appeal from the buyer.
          </p>

          <p className="font-semibold">
            RYU POWERTOOLS shipping costs borne by the buyer.
          </p>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <span className="text-xl font-bold text-[#2d5016]">
          INVERTER WARRANTY INFORMATION
        </span>
      ),
      children: (
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <p className="font-semibold text-[#2d5016] mb-3">
              Warranty Service valid for 1 year from the date of purchase with the following conditions:
            </p>
            <ul className="list-none space-y-2 ml-4">
              <li>
                <span className="font-semibold">a.</span> Send the warranty card to PO. Box 4040 JKT 11040 within 14 days from the date of purchase.
              </li>
              <li>
                <span className="font-semibold">b.</span> Warranty is valid for 2 (two) years from the date of purchase.
                <ul className="list-none space-y-1 ml-6 mt-2">
                  <li>– First year warranty of free spare parts replacement.</li>
                  <li>– The next one year warranty, get 40% discount for spare parts.</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">c.</span> Lifetime warranty service.
              </li>
            </ul>
          </div>

          <p>
            Warranty only applies if there is damage as a result of production/manufacture's error or material error in RYU INVERTER based on inspection of RYU Authorized Service Center.
          </p>

          <div>
            <p className="font-semibold text-[#2d5016] mb-3">Warranty does not apply:</p>
            <ul className="list-none space-y-2 ml-4">
              <li>
                <span className="font-semibold">a.</span> Warranty card is still in a state of blank (empty), model and serial number does not match the actual items.
              </li>
              <li>
                <span className="font-semibold">b.</span> Warranty card is not completely filled out, no stamp/signature by the dealer/store and has not been received within 14 (fourteen) days by the RYU Authorized Service Center.
              </li>
              <li>
                <span className="font-semibold">c.</span> Damaged due to improper usage, not according to the manual instructions.
              </li>
              <li>
                <span className="font-semibold">d.</span> Damage caused by user negligence and natural disasters.
              </li>
              <li>
                <span className="font-semibold">e.</span> Opening/disassembling or repairing by anyone other than an RYU Authorized Service Center.
              </li>
              <li>
                <span className="font-semibold">f.</span> Change/modify, or use accessories that are not in accordance with the application.
              </li>
              <li>
                <span className="font-semibold">g.</span> Wearing non-original parts or modified parts.
              </li>
            </ul>
          </div>

          <p className="font-semibold">
            RYU Authorized Service Center reserves the right to decide and determine to accept or reject the claim without any appeal from the buyer.
          </p>
        </div>
      ),
    },
  ];
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#2d5016] text-center underline mb-4">
          GENERAL WARRANTY INFORMATION
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Please review the warranty terms for your product category below
        </p>

        <div className="space-y-8">
          {items.map((item) => (
            <div key={item.key} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
              <div className="mb-4">{item.label}</div>
              <div>{item.children}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-center text-gray-700 text-sm">
            For warranty claims and inquiries, please contact your nearest{' '}
            <a href="/service-center" className="text-[#2d5016] font-semibold hover:underline">
              RYU Authorized Service Center
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPage;
