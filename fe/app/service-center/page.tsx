'use client';

import React, { useState } from 'react';
import { Card, Collapse, Button, Input, Space } from 'antd';
import { SearchOutlined, EnvironmentOutlined, PhoneOutlined, MessageOutlined, RightOutlined } from '@ant-design/icons';

interface ServiceCenter {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  whatsapp: string;
  expanded?: boolean;
}

const serviceCenters: ServiceCenter[] = [
  {
    id: 'jakarta-baru',
    name: 'SERVICE CENTER JAKARTA (MUARA BARU)',
    location: 'Jakarta',
    address: 'GANG MARLINA NO.12 B MUARA BARU – TLP / Whatsapp 0811-1919-9043',
    phone: '',
    whatsapp: '0811-1919-9043',
  },
  {
    id: 'jakarta-ltc',
    name: 'SERVICE CENTER LTC JAKARTA',
    location: 'Jakarta',
    address: 'LINDETEVES TRADE CENTER LANTAI GF 2 BLOK C 27 NO. 7/8 JAKARTA – TLP / Whatsapp 0811-1921-8644',
    phone: '',
    whatsapp: '0811-1921-8644',
  },
  {
    id: 'bandung',
    name: 'SERVICE CENTER BANDUNG',
    location: 'Bandung',
    address: 'JL. LENGKONG KECIL NO. 30 B – TLP / Whatsapp 0811-1921-6645',
    phone: '',
    whatsapp: '0811-1921-6645',
  },
  {
    id: 'surabaya',
    name: 'SERVICE CENTER SURABAYA',
    location: 'Surabaya',
    address: 'JL. PLOSO TIMUR VA NO 47 KEL. PLOSO, KEC. TAMBAKSARI SURABAYA, JAWA TIMUR 60133 – WHATSAPP: 081119216647',
    phone: '',
    whatsapp: '081119216647',
  },
  {
    id: 'semarang',
    name: 'SERVICE CENTER SEMARANG',
    location: 'Semarang',
    address: 'JLN. DR CIPTO NO. 6C RW 05 KEL BUGANGAN, KEC SEMARANG TIMUR 50123 – TLP / Whatsapp 0811-1921-6646',
    phone: '',
    whatsapp: '0811-1921-6646',
  },
  {
    id: 'bali',
    name: 'SERVICE CENTER BALI',
    location: 'Bali',
    address: 'JL. GATOT SUBROTO NO.244 RT 000 / RW 00 KEL TONJA – TLP / Whatsapp 0811-1921-6651',
    phone: '',
    whatsapp: '0811-1921-6651',
  },
  {
    id: 'samarinda',
    name: 'SERVICE CENTER SAMARINDA',
    location: 'Samarinda',
    address: 'JL. AHMAD YANI NO 6 SUNGAI PINANG DALAM KEL TEMINDUNG PERMAI, KEC SUNGAI PINANG KOTA SAMARINDA, KALIMANTAN TIMUR, 75117 – Whatsapp 0811-1921-6648',
    phone: '',
    whatsapp: '0811-1921-6648',
  },
  {
    id: 'banjarmasin',
    name: 'SERVICE CENTER BANJARMASIN',
    location: 'Banjarmasin',
    address: 'JLN. SOETOYO S NO.155 RT034/003 KEL TELUK DALAM, KEC BANJARMASIN TENGAH – TLP / Whatsapp 0811-1921-6649',
    phone: '',
    whatsapp: '0811-1921-6649',
  },
  {
    id: 'pontianak',
    name: 'SERVICE CENTER PONTIANAK',
    location: 'Pontianak',
    address: 'JL. TANJUNG PURA NO.206A RT.004/03, BENUA MELAYU LAUT, PONTIANAK SELATAN – TLP / Whatsapp 0811-1921-6650',
    phone: '',
    whatsapp: '0811-1921-6650',
  },
  {
    id: 'medan',
    name: 'SERVICE CENTER MEDAN',
    location: 'Medan',
    address: 'JL.PANDU NO 10 KEL : AUR KEC : MEDAN MAIMUN, MEDAN, SUMATERA UTARA – TLP / Whatsapp 0811-1921-6639',
    phone: '',
    whatsapp: '0811-1921-6639',
  },
  {
    id: 'pekanbaru',
    name: 'SERVICE CENTER PEKANBARU',
    location: 'Pekanbaru',
    address: 'JL. KURAS NO. 3 C KEL KAMPUNG BARU, KEC SENAPELAN, KOTA PEKANBARU – TLP / Whatsapp 0811-1921-6640',
    phone: '',
    whatsapp: '0811-1921-6640',
  },
  {
    id: 'lampung',
    name: 'SERVICE CENTER LAMPUNG',
    location: 'Lampung',
    address: 'JL. IKAN TENGGIRI NO.124 LK II RT 023/PESAWAHAN, TELUK BETUNG SELATAN, BANDAR LAMPUNG – TLP / Whatsapp 0811-1921-6643',
    phone: '',
    whatsapp: '0811-1921-6643',
  },
  {
    id: 'palembang',
    name: 'SERVICE CENTER PALEMBANG',
    location: 'Palembang',
    address: 'JL DR.M.ISA NO 11 KEL.DUKU, KEC.ILIR TIMUR II KOTA PALEMBANG, SUMSEL, 30114 – TLP / Whatsapp 0811-1921-6642',
    phone: '',
    whatsapp: '0811-1921-6642',
  },
  {
    id: 'makassar',
    name: 'SERVICE CENTER MAKASSAR',
    location: 'Makassar',
    address: 'JL. SUMBA NO.15 A, KEL PATTUNUANG KEC WAJO MAKASSAR – TLP / Whatsapp 0811-1921-6652',
    phone: '',
    whatsapp: '0811-1921-6652',
  },
  {
    id: 'manado',
    name: 'SERVICE CENTER MANADO',
    location: 'Manado',
    address: 'JL. LUMIMUUT NO 43, MAHAKERET TIMUR KEC.WENANG, KOTA MANADO SULUT, 95112 – TLP / Whatsapp 0811-1921-6653',
    phone: '',
    whatsapp: '0811-1921-6653',
  },
  {
    id: 'jambi',
    name: 'SERVICE CENTER JAMBI',
    location: 'Jambi',
    address: 'Jl. HOS COKROAMINOTO, NO. 26 SIMPANG KAWAT, KOTA BARU, PAYO LEBAR, JELUTUNG, KECAMATAN JELUTUNG, KOTA JAMBI, JAMBI 36135 (SEBELAH YOSSI MANDIRI TRAVEL) – TLP / Whatsapp 0811-1921-6641',
    phone: '',
    whatsapp: '0811-1921-6641',
  },
];

const ServiceCenterPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const filteredCenters = serviceCenters.filter((center) =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const items = filteredCenters.map((center) => ({
    key: center.id,
    label: (
      <div className="flex justify-between items-center w-full pr-4">
        <span
          className={
            `font-semibold text-base ${activeKeys.includes(center.id) ? 'text-[#72bd5a]' : 'text-black'}`
          }
        >
          {center.name}
        </span>
      </div>
    ),
    children: (
      <div className="py-2">
        <p className="text-gray-700 leading-relaxed">{center.address}</p>
        {center.whatsapp && (
          <a
            href={`https://wa.me/${center.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2d5016] font-semibold hover:underline mt-3 inline-flex items-center gap-2"
          >
            <MessageOutlined /> Chat WhatsApp
          </a>
        )}
      </div>
    ),
  }));

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-[#2d5016] mb-3 underline">
          SERVICE CENTER
        </h1>
      </div>
      {/* Service Centers List */}
      <div className="space-y-4">
        {filteredCenters.length > 0 ? (
          <Collapse
            items={items}
            className="bg-white"
            bordered={false}
            style={{ backgroundColor: 'white' }}
            activeKey={activeKeys}
            
            onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys : [keys])}
            expandIcon={({ isActive }) =>
              isActive ? (
                <RightOutlined className="text-[#72bd5a]" rotate={90} />
              ) : (
                <SearchOutlined className="text-gray-400" />
              )
            }
            expandIconPosition="end"
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              No service centers found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div className="mt-16 pt-8 border-t border-black flex ">
        <button
          type="button"
          className="px-8 sm:px-10 py-2 sm:py-2.5 rounded-full border border-primary bg-primary text-white text-sm sm:text-base  tracking-wide transition-colors hover:bg-transparent hover:text-[#2d5016] cursor-pointer"
        >
          CONTACT US
        </button>
      </div>
      </div>
    </div>
  );
};

export default ServiceCenterPage;
