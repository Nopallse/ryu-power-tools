'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input, Space, Menu, Drawer, Button } from 'antd';
import { SearchOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { CategoryNode } from '@/app/lib/category-api';
import { getPublicCategoryTree } from '@/app/lib/category-api';
import styles from './navbar.module.css';

const staticMenuItems: MenuProps['items'] = [
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
        Category <span className={styles.arrowIcon} style={{ display: 'inline-block', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid #1d1b1b', marginLeft: '4px' }}></span>
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
        Service & Support <span className={styles.arrowIcon} style={{ display: 'inline-block', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid #1d1b1b', marginLeft: '4px' }}></span>
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
  const [menuItems, setMenuItems] = useState<MenuProps['items']>(staticMenuItems);

  useEffect(() => {
    (async () => {
      try {
        const categoryTree = await getPublicCategoryTree();
        const dynamicMenuItems = buildMenuItems(categoryTree);
        setMenuItems(dynamicMenuItems);
      } catch (error) {
        console.error('Failed to load categories:', error);
        // Keep static menu items on error
      }
    })();
  }, []);

  const buildMenuItems = (categories: CategoryNode[]): MenuProps['items'] => {
    const categoryItems = buildCategoryMenu(categories);
    
    // Insert categories into the menu structure
    return [
      staticMenuItems![0], // Home
      staticMenuItems![1], // Blog
      {
        key: 'category',
        label: (
          <span>
            Category <span className={styles.arrowIcon} style={{ display: 'inline-block', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid #1d1b1b', marginLeft: '4px' }}></span>
          </span>
        ),
        children: categoryItems,
      },
      staticMenuItems![3], // Catalog
      staticMenuItems![4], // Service & Support
    ];
  };

  const buildCategoryMenu = (categories: CategoryNode[], parentPath: string = ''): MenuProps['items'] => {
    if (!categories || categories.length === 0) return [];

    return categories.map((cat) => {
      const hasChildren = cat.children && cat.children.length > 0;
      const currentPath = parentPath ? `${parentPath}/${cat.slug}` : cat.slug;
      const fullPath = `/product-category/category/${currentPath}`;
      
      return {
        key: cat.id,
        label: hasChildren ? cat.name : <Link href={fullPath}>{cat.name}</Link>,
        children: hasChildren ? buildCategoryMenu(cat.children!, currentPath) : undefined,
      };
    });
  };

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
            src="/images/logo.png"
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
        placement="left"
        onClose={toggleDrawer}
        open={drawerVisible}
        className={styles.drawer}
        size={280}
        closeIcon={<CloseOutlined style={{ fontSize: '20px', color: '#ffffff' }} />}
        title={
          <div className={styles.drawerHeader}>
            <Image
              src="/images/logo.png"
              alt="Ryu Power Tools"
              width={100}
              height={36}
              className={styles.drawerLogo}
            />
          </div>
        }
        styles={{
          header: {
            background: '#2d6a2e',
            borderBottom: 'none',
            padding: '16px 20px'
          },
          body: {
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
          }
        }}
      >
        <div className={styles.drawerContent}>
          <Menu
            mode="inline"
            items={menuItems}
            className={styles.drawerMenu}
            defaultSelectedKeys={['home']}
            onClick={toggleDrawer}
          />
        </div>
        
        <div className={styles.drawerFooter}>
          <div className={styles.footerDivider}></div>
          <div className={styles.langSwitchDrawer}>
            <span className={styles.langLabel}>Language</span>
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
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;