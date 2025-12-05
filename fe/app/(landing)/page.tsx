'use client';

import React from 'react';
import { Button } from 'antd';
import styles from './landing.module.css';

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Engineered for Impact,<br />
              Made for Everyone.
            </h1>
            <p className={styles.heroSubtitle}>
              High-performance tools engineered<br />
              for precision, built with power & ready<br />
              for everyday challenges.
            </p>
            <Button 
              type="primary" 
              size="large"
              className={styles.heroButton}
            >
              POWER UP
            </Button>
          </div>
          <div className={styles.heroImage}>
            <img 
              src="/images/ryu-tools-stack.png" 
              alt="Ryu Power Tools Collection" 
            />
          </div>
        </div>
      </section>
    </div>
  );
}
