'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input, Space, Menu, Drawer, Button } from 'antd';
import { SearchOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const menuItems: MenuProps['items'] = [
  {
    key: 'home',
    label: <Link href="/">Home</Link>,
  },
  {
    key: 'blog',
    label: <Link href="/blog">Blog</Link>,
  },
  {
    key: 'category',
    label: (
      <span>
        Category <span style={{ display: 'inline-block', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid #1d1b1b', marginLeft: '4px' }}></span>
      </span>
    ),
    children: [
      {
        key: 'accessories',
        label: 'Accessories',
        children: [
          { key: 'accessories-cable', label: <Link href="/product-category/accessories/cable-connector">Cable Connector</Link> },
          { key: 'accessories-abrasive', label: <Link href="/product-category/accessories/abrasive">Abrasive</Link> },
          { key: 'accessories-blade', label: <Link href="/product-category/accessories/circular-saw-blade">Circular Saw Blade</Link> },
          { key: 'accessories-wheel', label: <Link href="/product-category/accessories/diamond-wheel">Diamond Wheel</Link> },
          { key: 'accessories-drill', label: <Link href="/product-category/accessories/drill-bits">Drill Bits</Link> },
          { key: 'accessories-planner', label: <Link href="/product-category/accessories/planner-blade">Planner Blade</Link> },
        ],
      },
      {
        key: 'engine',
        label: 'Engine',
        children: [
          { key: 'engine-chainsaw', label: <Link href="/product-category/engine/chain-saw">Chain Saw</Link> },
          { key: 'engine-compressor', label: <Link href="/product-category/engine/compressor">Compressor</Link> },
          { key: 'engine-gasoline', label: <Link href="/product-category/engine/gasoline-engine">Gasoline Engine</Link> },
          { key: 'engine-generator', label: <Link href="/product-category/engine/generator">Generator</Link> },
          { key: 'engine-waterpump', label: <Link href="/product-category/engine/waterpump">Waterpump</Link> },
        ],
      },
      {
        key: 'power-tools',
        label: 'Power Tools',
        children: [
          {
            key: 'metal-working',
            label: 'Metal Working',
            children: [
              { key: 'angle-grinder', label: <Link href="/product-category/power-tools/angle-grinder">Angle Grinder</Link> },
              { key: 'bench-drill', label: <Link href="/product-category/power-tools/bench-drill">Bench Drill</Link> },
              { key: 'cut-off-saw', label: <Link href="/product-category/power-tools/cut-off-saw">Cut Off saw</Link> },
              { key: 'die-grinders', label: <Link href="/product-category/power-tools/die-grinders">Die Grinders</Link> },
              { key: 'drill', label: <Link href="/product-category/power-tools/drill">Drill</Link> },
              { key: 'impact-drill', label: <Link href="/product-category/power-tools/impact-drill">Impact Drill</Link> },
              { key: 'magnetic-drill', label: <Link href="/product-category/power-tools/magnetic-drill">Magnetic Drill</Link> },
            ],
          },
          {
            key: 'wood-working',
            label: 'Wood Working',
            children: [
              { key: 'circular-saw', label: <Link href="/product-category/power-tools/circular-saw">Circular Saw</Link> },
              { key: 'jig-saw', label: <Link href="/product-category/power-tools/jig-saw">Jig Saw</Link> },
              { key: 'mitter-saw', label: <Link href="/product-category/power-tools/mitter-saw">Mitter Saw</Link> },
              { key: 'planner', label: <Link href="/product-category/power-tools/planner">Planner</Link> },
              { key: 'router', label: <Link href="/product-category/power-tools/router">Router</Link> },
              { key: 'sander', label: <Link href="/product-category/power-tools/sander">Sander</Link> },
              { key: 'trimmer', label: <Link href="/product-category/power-tools/trimmer">Trimmer</Link> },
              { key: 'band-saw', label: <Link href="/product-category/power-tools/band-saw">Band Saw</Link> },
            ],
          },
          {
            key: 'general-working',
            label: 'General Working',
            children: [
              { key: 'blower', label: <Link href="/product-category/power-tools/blower">Blower</Link> },
              { key: 'demolition-hammer', label: <Link href="/product-category/power-tools/demolition-hammer">Demolition Hammer</Link> },
              { key: 'cordless', label: <Link href="/product-category/power-tools/cordless">Cordless</Link> },
              { key: 'cordless-glue-gun', label: <Link href="/product-category/power-tools/cordless-glue-gun">Cordless Glue Gun</Link> },
              { key: 'grass-trimmer', label: <Link href="/product-category/power-tools/grass-trimmer">Grass Trimmer</Link> },
              { key: 'heat-gun', label: <Link href="/product-category/power-tools/heat-gun">Heat Gun</Link> },
              { key: 'gun-polisher', label: <Link href="/product-category/power-tools/gun-polisher">Gun Polisher</Link> },
              { key: 'marble-cutter', label: <Link href="/product-category/power-tools/marble-cutter">Marble Cutter</Link> },
              { key: 'polisher', label: <Link href="/product-category/power-tools/polisher">Polisher</Link> },
              { key: 'pressure-washer', label: <Link href="/product-category/power-tools/pressure-washer">Pressure Washer</Link> },
              { key: 'rotary-hammer', label: <Link href="/product-category/power-tools/rotary-hammer">Rotary Hammer</Link> },
              { key: 'spray-gun', label: <Link href="/product-category/power-tools/spray-gun">Spray Gun</Link> },
              { key: 'vacum-cleaner', label: <Link href="/product-category/power-tools/vacum-cleaner">Vacum Cleaner</Link> },
            ],
          },
        ],
      },
      {
        key: 'welding',
        label: 'Welding',
        children: [{ key: 'inverter', label: <Link href="/product-category/welding/inverter">Inverter</Link> }],
      },
    ],
  },
  {
    key: 'catalog',
    label: (
      <a 
        href="/catalog/ryu-catalog.pdf" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        View Catalog
      </a>
    ),
  },
  {
    key: 'service-support',
    label: (
      <span>
        Service & Support <span style={{ display: 'inline-block', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid #1d1b1b', marginLeft: '4px' }}></span>
      </span>
    ),
    children: [
      { key: 'service-center', label: <Link href="/service-center">Service Center</Link> },
      { key: 'where-to-buy', label: <Link href="/where-to-buy">Where To Buy</Link> },
      { 
        key: 'altama-ecare', 
        label: (
          <a 
            href="https://play.google.com/store/apps/details?id=id.co.carepoint&pli=1" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Altama E Care
          </a>
        )
      },
      { key: 'contact', label: <Link href="/contact">Contact</Link> },
      { key: 'warranty', label: <Link href="/warranty">Warranty</Link> },
    ],
  },
];

const Navbar: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [language, setLanguage] = useState<'en' | 'id'>('en');

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const switchLanguage = (lang: 'en' | 'id') => {
    setLanguage(lang);
    // Di sini bisa ditambahkan logic untuk mengubah bahasa di seluruh website
    console.log('Language switched to:', lang);
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-[100]">
      <div className="flex items-center justify-between gap-6 py-3 px-4 sm:px-8 max-w-[1400px] mx-auto">
        {/* Hamburger Menu - Mobile */}
        <button 
          className="lg:hidden flex items-center justify-center bg-transparent border-none cursor-pointer p-2 text-[#1d1b1b]" 
          onClick={toggleDrawer} 
          aria-label="Menu"
        >
          <MenuOutlined style={{ fontSize: '24px' }} />
        </button>

        {/* Logo */}
        <Link href="/" className="inline-flex items-center h-10 flex-1 lg:flex-none justify-center lg:justify-start">
          <Image
            src="/logo.jpg"
            alt="Ryu Power Tools"
            width={120}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center uppercase tracking-tight font-bold text-[12px] xl:text-[13px] text-[#1a1a1a] flex-1">
          <Menu
            mode="horizontal"
            items={menuItems}
            defaultSelectedKeys={['home']}
            className="flex-1 border-b-0 bg-transparent font-bold text-[12px] xl:text-[13px] tracking-tight [&_.ant-menu-item]:uppercase [&_.ant-menu-submenu-title]:uppercase [&_.ant-menu-item]:text-[#1d1b1b] [&_.ant-menu-submenu-title]:text-[#1d1b1b] [&_.ant-menu-item]:px-1.5 [&_.ant-menu-submenu-title]:px-1.5 [&_.ant-menu-item]:h-auto [&_.ant-menu-submenu-title]:h-auto [&_.ant-menu-item]:leading-normal [&_.ant-menu-submenu-title]:leading-normal [&_.ant-menu-item]:border-b-0 [&_.ant-menu-item-selected]:bg-transparent [&_.ant-menu-item-selected]:text-[#1d1b1b] [&_.ant-menu-item-selected]:border-b-0 [&_.ant-menu-item::after]:hidden [&_.ant-menu-submenu-title::after]:hidden [&_.ant-menu-submenu>.ant-menu-submenu-title:hover]:text-[#1d1b1b] [&_.ant-menu-item:hover]:text-[#1d1b1b] [&_.ant-menu-submenu-title:hover]:text-[#1d1b1b] [&_.ant-menu-submenu-popup]:bg-white [&_.ant-menu-vertical_.ant-menu-item]:pl-3 [&_.ant-menu-vertical_.ant-menu-submenu-title]:pl-3 [&_.ant-menu-submenu-arrow]:text-[#1d1b1b]"
          />
        </nav>

        {/* Actions */}
        <Space size={16} className="inline-flex items-center gap-3">
          {/* Search Button - Mobile */}
          <button 
            className="lg:hidden flex items-center justify-center bg-transparent border-none cursor-pointer p-2 text-[#1d1b1b]" 
            onClick={toggleSearch} 
            aria-label="Search"
          >
            <SearchOutlined style={{ fontSize: '20px' }} />
          </button>
          
          {/* Search Input - Desktop */}
          <Input
            size="large"
            allowClear
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="Search Model, Product, etc"
            className="hidden lg:block w-[240px] xl:w-[520px] rounded-full px-3.5"
          />
          
          {/* Language Switch */}
          <div className="hidden lg:inline-flex items-center gap-1.5 bg-[#f5f5f5] p-1 rounded-lg">
            <button 
              type="button" 
              className={`w-9 h-8 rounded-md border-none bg-transparent cursor-pointer inline-flex items-center justify-center text-xl transition-all duration-200 hover:bg-black/5 hover:scale-105 ${language === 'en' ? 'bg-white shadow-md' : ''}`}
              onClick={() => switchLanguage('en')}
              aria-label="English"
            >
              <img src="/images/flags/uk.png" alt="English" className="w-6 h-4 object-cover rounded-sm" />
            </button>
            <button 
              type="button" 
              className={`w-9 h-8 rounded-md border-none bg-transparent cursor-pointer inline-flex items-center justify-center text-xl transition-all duration-200 hover:bg-black/5 hover:scale-105 ${language === 'id' ? 'bg-white shadow-md' : ''}`}
              onClick={() => switchLanguage('id')}
              aria-label="Bahasa Indonesia"
            >
              <img src="/images/flags/indonesia.png" alt="Indonesia" className="w-6 h-4 object-cover rounded-sm" />
            </button>
          </div>
        </Space>
      </div>

      {/* Mobile Search Bar */}
      {searchVisible && (
        <div className="lg:hidden block p-3 border-t border-[#e8e8e8] bg-white">
          <Input
            size="large"
            allowClear
            autoFocus
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="Search Model, Product, etc"
            className="w-full rounded-full"
          />
        </div>
      )}

      {/* Mobile Drawer Menu */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: '18px' }}>MENU</span>
          </div>
        }
        placement="left"
        onClose={toggleDrawer}
        open={drawerVisible}
        size={240}
        styles={{
          wrapper: {
            width: '240px',
            maxWidth: '65vw'
          },
          header: {
            background: '#2d6a2e',
            color: '#ffffff',
            borderBottom: 'none',
            padding: '16px 20px'
          },
          body: {
            padding: 0
          }
        }}
        closeIcon={<CloseOutlined style={{ color: '#ffffff' }} />}
      >
        <Menu
          mode="inline"
          items={menuItems}
          defaultSelectedKeys={['home']}
          onClick={toggleDrawer}
          className="border-r-0 font-semibold text-sm [&_.ant-menu-item]:pl-5 [&_.ant-menu-submenu-title]:pl-5 [&_.ant-menu-item]:uppercase [&_.ant-menu-submenu-title]:uppercase [&_.ant-menu-item]:tracking-wide [&_.ant-menu-submenu-title]:tracking-wide [&_.ant-menu-item-selected]:bg-[#2d6a2e]/10 [&_.ant-menu-item-selected]:text-[#2d6a2e]"
        />
        <div className="absolute bottom-5 left-5 right-5 pt-5 border-t border-[#e8e8e8] flex justify-center">
          <div className="inline-flex items-center gap-1.5 bg-[#f5f5f5] p-1 rounded-lg">
            <button 
              type="button" 
              className={`w-9 h-8 rounded-md border-none bg-transparent cursor-pointer inline-flex items-center justify-center text-xl transition-all duration-200 hover:bg-black/5 hover:scale-105 ${language === 'en' ? 'bg-white shadow-md' : ''}`}
              onClick={() => switchLanguage('en')}
              aria-label="English"
            >
              <img src="/images/flags/uk.png" alt="English" className="w-6 h-4 object-cover rounded-sm" />
            </button>
            <button 
              type="button" 
              className={`w-9 h-8 rounded-md border-none bg-transparent cursor-pointer inline-flex items-center justify-center text-xl transition-all duration-200 hover:bg-black/5 hover:scale-105 ${language === 'id' ? 'bg-white shadow-md' : ''}`}
              onClick={() => switchLanguage('id')}
              aria-label="Bahasa Indonesia"
            >
              <img src="/images/flags/indonesia.png" alt="Indonesia" className="w-6 h-4 object-cover rounded-sm" />
            </button>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;
