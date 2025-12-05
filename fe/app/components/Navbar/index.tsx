'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input, Space, Menu, Drawer, Button } from 'antd';
import { SearchOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from './navbar.module.css';

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
          { key: 'accessories-cable', label: 'Cable Connector' },
          { key: 'accessories-abrasive', label: 'Abrasive' },
          { key: 'accessories-blade', label: 'Circular Saw Blade' },
          { key: 'accessories-wheel', label: 'Diamond Wheel' },
          { key: 'accessories-drill', label: 'Drill Bits' },
          { key: 'accessories-planner', label: 'Planner Blade' },
        ],
      },
      {
        key: 'engine',
        label: 'Engine',
        children: [
          { key: 'engine-chainsaw', label: 'Chain Saw' },
          { key: 'engine-compressor', label: 'Compressor' },
          { key: 'engine-gasoline', label: 'Gasoline Engine' },
          { key: 'engine-generator', label: 'Generator' },
          { key: 'engine-waterpump', label: 'Waterpump' },
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
              { key: 'angle-grinder', label: 'Angle Grinder' },
              { key: 'bench-drill', label: 'Bench Drill' },
              { key: 'cut-off-saw', label: 'Cut Off saw' },
              { key: 'die-grinders', label: 'Die Grinders' },
              { key: 'drill', label: 'Drill' },
              { key: 'impact-drill', label: 'Impact Drill' },
              { key: 'magnetic-drill', label: 'Magnetic Drill' },
            ],
          },
          {
            key: 'wood-working',
            label: 'Wood Working',
            children: [
              { key: 'circular-saw', label: 'Circular Saw' },
              { key: 'jig-saw', label: 'Jig Saw' },
              { key: 'mitter-saw', label: 'Mitter Saw' },
              { key: 'planner', label: 'Planner' },
              { key: 'router', label: 'Router' },
              { key: 'sander', label: 'Sander' },
              { key: 'trimmer', label: 'Trimmer' },
              { key: 'band-saw', label: 'Band Saw' },
            ],
          },
          {
            key: 'general-working',
            label: 'General Working',
            children: [
              { key: 'blower', label: 'Blower' },
              { key: 'demolition-hammer', label: 'Demolition Hammer' },
              { key: 'cordless', label: 'Cordless' },
              { key: 'cordless-glue-gun', label: 'Cordless Glue Gun' },
              { key: 'grass-trimmer', label: 'Grass Trimmer' },
              { key: 'heat-gun', label: 'Heat Gun' },
              { key: 'gun-polisher', label: 'Gun Polisher' },
              { key: 'marble-cutter', label: 'Marble Cutter' },
              { key: 'polisher', label: 'Polisher' },
              { key: 'pressure-washer', label: 'Pressure Washer' },
              { key: 'rotary-hammer', label: 'Rotary Hammer' },
              { key: 'spray-gun', label: 'Spray Gun' },
              { key: 'vacum-cleaner', label: 'Vacum Cleaner' },
            ],
          },
        ],
      },
      {
        key: 'welding',
        label: 'Welding',
        children: [{ key: 'inverter', label: 'Inverter' }],
      },
    ],
  },
  {
    key: 'catalog',
    label: <Link href="/catalog">Download Catalog</Link>,
  },
  {
    key: 'service-support',
    label: (
      <span>
        Service & Support <span style={{ display: 'inline-block', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid #1d1b1b', marginLeft: '4px' }}></span>
      </span>
    ),
    children: [
      { key: 'service-center', label: 'Service Center' },
      { key: 'where-to-buy', label: 'Where To Buy' },
      { key: 'altama-ecare', label: 'Altama E Care' },
      { key: 'contact', label: 'Contact' },
      { key: 'warranty', label: 'Warranty' },
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
    <header className={styles.navbar}>
      <div className={styles.navbarContent}>
        <button className={styles.hamburger} onClick={toggleDrawer} aria-label="Menu">
          <MenuOutlined style={{ fontSize: '24px' }} />
        </button>

        <Link href="/" className={styles.logo}>
          <Image
            src="/logo.jpg"
            alt="Ryu Power Tools"
            width={140}
            height={48}
            priority
            className={styles.logoImg}
          />
        </Link>

        <nav className={styles.navLinks}>
          <Menu
            mode="horizontal"
            items={menuItems}
            className={styles.antMenu}
            defaultSelectedKeys={['home']}
          />
        </nav>

        <Space size={16} className={styles.actions}>
          <button className={styles.searchBtn} onClick={toggleSearch} aria-label="Search">
            <SearchOutlined style={{ fontSize: '20px' }} />
          </button>
          
          <Input
            size="large"
            allowClear
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="Search Model, Product, etc"
            className={styles.search}
          />
          
          <div className={styles.langSwitch}>
            <button 
              type="button" 
              className={`${styles.flagBtn} ${language === 'en' ? styles.flagBtnActive : ''}`}
              onClick={() => switchLanguage('en')}
              aria-label="English"
            >
              <img src="/images/flags/uk.png" alt="English" className={styles.flagImg} />
            </button>
            <button 
              type="button" 
              className={`${styles.flagBtn} ${language === 'id' ? styles.flagBtnActive : ''}`}
              onClick={() => switchLanguage('id')}
              aria-label="Bahasa Indonesia"
            >
              <img src="/images/flags/indonesia.png" alt="Indonesia" className={styles.flagImg} />
            </button>
          </div>
        </Space>
      </div>

      {/* Mobile Search Bar */}
      {searchVisible && (
        <div className={styles.mobileSearch}>
          <Input
            size="large"
            allowClear
            autoFocus
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="Search Model, Product, etc"
            className={styles.mobileSearchInput}
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
        className={styles.drawer}
        size={240}
        styles={{
          wrapper: {
            width: '240px',
            maxWidth: '65vw'
          }
        }}
      >
        <Menu
          mode="inline"
          items={menuItems}
          className={styles.drawerMenu}
          defaultSelectedKeys={['home']}
          onClick={toggleDrawer}
        />
        <div className={styles.drawerFooter}>
          <div className={styles.langSwitch}>
            <button 
              type="button" 
              className={`${styles.flagBtn} ${language === 'en' ? styles.flagBtnActive : ''}`}
              onClick={() => switchLanguage('en')}
              aria-label="English"
            >
              <img src="/images/flags/uk.png" alt="English" className={styles.flagImg} />
            </button>
            <button 
              type="button" 
              className={`${styles.flagBtn} ${language === 'id' ? styles.flagBtnActive : ''}`}
              onClick={() => switchLanguage('id')}
              aria-label="Bahasa Indonesia"
            >
              <img src="/images/flags/indonesia.png" alt="Indonesia" className={styles.flagImg} />
            </button>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;
