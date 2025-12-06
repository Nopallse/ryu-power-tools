'use client';

import React, { useState } from 'react';
import { Input, Select, Button } from 'antd';

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
    <div className="bg-white py-16 sm:py-20 lg:py-24 px-6 sm:px-8 md:px-10">
      <div className="max-w-4xl mx-auto">
        {/* General Contact Section */}
        <div className="mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2d5016] text-center underline mb-8">
            CONTACT US
          </h1>

          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <p className="text-center text-gray-700 text-lg mb-6">
              For all inquiries, please feel free to reach out at:
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-center">
              <a
                href="https://api.whatsapp.com/send?phone=6287777000966"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2d5016] hover:text-[#72bd5a] font-semibold transition-colors"
              >
                Whatsapp Customer Care +6287 7770 00966
              </a>
              <a
                href="tel:62216680180"
                className="text-[#2d5016] hover:text-[#72bd5a] font-semibold transition-colors"
              >
                Phone Number (021) 6680180
              </a>
            </div>
          </div>

          <form onSubmit={handleGeneralSubmit} className="space-y-4">
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

            <Input
              size="large"
              placeholder="Name"
              value={generalForm.name}
              onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
              required
            />

            <Input
              size="large"
              placeholder="Phone"
              value={generalForm.phone}
              onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
              required
            />

            <Input
              size="large"
              type="email"
              placeholder="Email"
              value={generalForm.email}
              onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
              required
            />

            <Input
              size="large"
              placeholder="City"
              value={generalForm.city}
              onChange={(e) => setGeneralForm({ ...generalForm, city: e.target.value })}
              required
            />

            <TextArea
              rows={4}
              placeholder="Message"
              value={generalForm.message}
              onChange={(e) => setGeneralForm({ ...generalForm, message: e.target.value })}
              required
              className="resize-none"
            />

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
                className="px-12 py-3 bg-[#2d5016] text-white font-semibold rounded hover:bg-[#72bd5a] transition-colors cursor-pointer"
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

          <form onSubmit={handleEventSubmit} className="space-y-4">
            <Select
              value={eventForm.type}
              onChange={(value) => setEventForm({ ...eventForm, type: value })}
              size="large"
              className="w-full"
            >
              <Option value="OFFLINE">OFFLINE</Option>
              <Option value="ONLINE">ONLINE</Option>
            </Select>

            <Input
              size="large"
              placeholder="Name"
              value={eventForm.name}
              onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
              required
            />

            <Input
              size="large"
              placeholder="Phone"
              value={eventForm.phone}
              onChange={(e) => setEventForm({ ...eventForm, phone: e.target.value })}
              required
            />

            <Input
              size="large"
              type="email"
              placeholder="Email"
              value={eventForm.email}
              onChange={(e) => setEventForm({ ...eventForm, email: e.target.value })}
              required
            />

            <Input
              size="large"
              placeholder="City"
              value={eventForm.city}
              onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })}
              required
            />

            <TextArea
              rows={4}
              placeholder="Message"
              value={eventForm.message}
              onChange={(e) => setEventForm({ ...eventForm, message: e.target.value })}
              required
              className="resize-none"
            />

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
                className="px-12 py-3 bg-[#2d5016] text-white font-semibold rounded hover:bg-[#72bd5a] transition-colors cursor-pointer"
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
