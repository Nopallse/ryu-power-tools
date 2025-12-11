'use client';

import React, { useState } from 'react';
import { Input, Select } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const ContactPage = () => {
  const [generalForm, setGeneralForm] = useState({
    type: 'Customer Care',
    name: '',
    phone: '',
    email: '',
    city: '',
    message: '',
  });

  const [eventForm, setEventForm] = useState({
    type: 'OFFLINE',
    name: '',
    phone: '',
    email: '',
    city: '',
    message: '',
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('General form submitted:', generalForm);
    // Add your form submission logic here
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Event form submitted:', eventForm);
    // Add your form submission logic here
  };

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        {/* General Contact Section */}
        <div className="mb-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary text-center">
            CONTACT US
          </h1>

          <div className="bg-white rounded-lg p-4 mb-8">
            <p className="text-center text-[#324A6D] text-sm mb-6">
              For all inquiries, please feel free to reach out at:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center', color: '#324A6D', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <a
                href="https://api.whatsapp.com/send?phone=6287777000966"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#324A6D', fontWeight: '600', transition: 'color 0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#72bd5a')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#324A6D')}
              >
                Whatsapp Customer Care +6287 7770 00966
              </a>
              <span>|</span>
              <a
                href="tel:62216680180"
                style={{ color: '#324A6D', fontWeight: '600', transition: 'color 0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#72bd5a')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#324A6D')}
              >
                Phone Number (021) 6680180
              </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleGeneralSubmit} className="space-y-5 max-w-2xl mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Type
              </label>
              <Select
                value={generalForm.type}
                onChange={(value) => setGeneralForm({ ...generalForm, type: value })}
                size="large"
                className="w-full"
              >
                <Option value="Customer Care">Customer Care</Option>
                <Option value="Distributor">Distributor</Option>
                <Option value="Reseller">Reseller</Option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <Input
                size="large"
                placeholder="Name"
                value={generalForm.name}
                onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <Input
                size="large"
                placeholder="Phone"
                value={generalForm.phone}
                onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <Input
                size="large"
                type="email"
                placeholder="Email"
                value={generalForm.email}
                onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <Input
                size="large"
                placeholder="City"
                value={generalForm.city}
                onChange={(e) => setGeneralForm({ ...generalForm, city: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <TextArea
                rows={4}
                placeholder="Message"
                value={generalForm.message}
                onChange={(e) => setGeneralForm({ ...generalForm, message: e.target.value })}
                required
                className="resize-none"
              />
            </div>

            <p className="text-sm text-gray-600">
              This site is protected by reCAPTCHA and the Google{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener"
                className="text-[#2d5016] hover:underline"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener"
                className="text-[#2d5016] hover:underline"
              >
                Terms of Service
              </a>{' '}
              apply.
            </p>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 sm:px-10 py-1 sm:py-1.5 rounded-full border border-primary bg-primary text-white text-sm sm:text-base font-semibold tracking-wide transition-colors hover:bg-transparent hover:text-[#2d5016] cursor-pointer"
              >
                Send
              </button>
            </div>
          </form>
        </div>

        {/* Event Contact Section */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2d5016] text-center underline mb-8">
            CONTACT US FOR EVENT
          </h1>

          <form onSubmit={handleEventSubmit} className="space-y-5 max-w-2xl mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <Select
                value={eventForm.type}
                onChange={(value) => setEventForm({ ...eventForm, type: value })}
                size="large"
                className="w-full"
              >
                <Option value="OFFLINE">OFFLINE</Option>
                <Option value="ONLINE">ONLINE</Option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <Input
                size="large"
                placeholder="Name"
                value={eventForm.name}
                onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <Input
                size="large"
                placeholder="Phone"
                value={eventForm.phone}
                onChange={(e) => setEventForm({ ...eventForm, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <Input
                size="large"
                type="email"
                placeholder="Email"
                value={eventForm.email}
                onChange={(e) => setEventForm({ ...eventForm, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <Input
                size="large"
                placeholder="City"
                value={eventForm.city}
                onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <TextArea
                rows={4}
                placeholder="Message"
                value={eventForm.message}
                onChange={(e) => setEventForm({ ...eventForm, message: e.target.value })}
                required
                className="resize-none"
              />
            </div>

            <p className="text-sm text-gray-600">
              This site is protected by reCAPTCHA and the Google{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener"
                className="text-[#2d5016] hover:underline"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener"
                className="text-[#2d5016] hover:underline"
              >
                Terms of Service
              </a>{' '}
              apply.
            </p>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 sm:px-10 py-1 sm:py-1.5 rounded-full border border-primary bg-primary text-white text-sm sm:text-base font-semibold tracking-wide transition-colors hover:bg-transparent hover:text-[#2d5016] cursor-pointer"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
