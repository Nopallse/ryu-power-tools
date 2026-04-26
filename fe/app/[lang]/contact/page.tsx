'use client';

import React, { useState } from 'react';
import { Input, Select, message } from 'antd';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { submitGeneralContact, submitEventContact } from '@/app/lib/contact-api';

const { TextArea } = Input;
const { Option } = Select;

const ContactPage = () => {
  const { t } = useLanguage();
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

  const [generalLoading, setGeneralLoading] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralLoading(true);

    try {
      const payload = {
        contact_type: generalForm.type,
        name: generalForm.name,
        phone: generalForm.phone,
        email: generalForm.email,
        city: generalForm.city,
        message: generalForm.message,
      };

      await submitGeneralContact(payload);
      message.success(t.contact.successMessage || 'Your message has been sent successfully!');
      
      // Reset form
      setGeneralForm({
        type: 'Customer Care',
        name: '',
        phone: '',
        email: '',
        city: '',
        message: '',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting the form';
      message.error(errorMessage);
      console.error('Error submitting general contact form:', error);
    } finally {
      setGeneralLoading(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventLoading(true);

    try {
      const payload = {
        event_type: eventForm.type,
        name: eventForm.name,
        phone: eventForm.phone,
        email: eventForm.email,
        city: eventForm.city,
        message: eventForm.message,
      };

      await submitEventContact(payload);
      message.success(t.contact.successMessage || 'Your event inquiry has been sent successfully!');
      
      // Reset form
      setEventForm({
        type: 'OFFLINE',
        name: '',
        phone: '',
        email: '',
        city: '',
        message: '',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting the form';
      message.error(errorMessage);
      console.error('Error submitting event contact form:', error);
    } finally {
      setEventLoading(false);
    }
  };

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        {/* General Contact Section */}
        <div className="mb-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary text-center">
            {t.contact.title.toUpperCase()}
          </h1>

            <div className="bg-white rounded-lg p-4 mb-8">
            <p className="text-center text-[#324A6D] text-sm mb-6">
              {t.contact.forInquiries}
            </p>
            <div className="flex flex-col gap-4 text-center text-[#324A6D] text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-8 flex-wrap">
                <a
                href="https://api.whatsapp.com/send?phone=6287777000966"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold transition-colors hover:!text-[#72bd5a] break-all"
                style={{ color: '#324A6D' }}
                >
                {t.contact.whatsappCustomerCare}
                </a>
              <span className="hidden sm:inline">|</span>
              <a
                href="tel:62216680180"
                className="font-semibold transition-colors hover:!text-[#72bd5a] break-all"
                style={{ color: '#324A6D' }}
              >
                {t.contact.phoneNumber}
              </a>
              </div>
            </div>
            </div>

          <form onSubmit={handleGeneralSubmit} className="space-y-5 max-w-2xl mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.contact.contactType}
              </label>
              <Select
                value={generalForm.type}
                onChange={(value) => setGeneralForm({ ...generalForm, type: value })}
                size="large"
                className="w-full"
              >
                <Option value="Customer Care">{t.contact.customerCare}</Option>
                <Option value="Distributor">{t.contact.distributor}</Option>
                <Option value="Reseller">{t.contact.reseller}</Option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.contact.name} *
              </label>
              <Input
                size="large"
                placeholder={t.contact.name}
                value={generalForm.name}
                onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.contact.phone} *
              </label>
              <Input
                size="large"
                placeholder={t.contact.phone}
                value={generalForm.phone}
                onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.contact.email} *
              </label>
              <Input
                size="large"
                type="email"
                placeholder={t.contact.email}
                value={generalForm.email}
                onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.common.city} *
              </label>
              <Input
                size="large"
                placeholder={t.common.city}
                value={generalForm.city}
                onChange={(e) => setGeneralForm({ ...generalForm, city: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.contact.message} *
              </label>
              <TextArea
                rows={4}
                placeholder={t.contact.message}
                value={generalForm.message}
                onChange={(e) => setGeneralForm({ ...generalForm, message: e.target.value })}
                required
                className="resize-none"
              />
            </div>

            <p className="text-sm text-gray-600">
              {t.contact.recaptchaNotice}
            </p>

            <div className="flex justify-center sm:justify-end">
              <button
                type="submit"
                disabled={generalLoading}
                className="px-8 sm:px-10 py-2 sm:py-2.5 rounded-full border border-primary bg-primary text-white text-sm sm:text-base tracking-wide transition-colors hover:bg-transparent hover:text-[#2d5016] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generalLoading ? t.common.loading || 'Loading...' : t.contact.send}
              </button>
            </div>
          </form>
        </div>

        {/* Event Contact Section */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary text-center">
            {t.contact.contactEventTitle}
          </h1>

          <form onSubmit={handleEventSubmit} className="space-y-5 max-w-2xl mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.contact.eventType}
              </label>
              <Select
                value={eventForm.type}
                onChange={(value) => setEventForm({ ...eventForm, type: value })}
                size="large"
                className="w-full"
              >
                <Option value="OFFLINE">{t.contact.offline}</Option>
                <Option value="ONLINE">{t.contact.online}</Option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.contact.name} *
              </label>
              <Input
                size="large"
                placeholder={t.contact.name}
                value={eventForm.name}
                onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.contact.phone} *
              </label>
              <Input
                size="large"
                placeholder={t.contact.phone}
                value={eventForm.phone}
                onChange={(e) => setEventForm({ ...eventForm, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.contact.email} *
              </label>
              <Input
                size="large"
                type="email"
                placeholder={t.contact.email}
                value={eventForm.email}
                onChange={(e) => setEventForm({ ...eventForm, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.common.city} *
              </label>
              <Input
                size="large"
                placeholder={t.common.city}
                value={eventForm.city}
                onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.contact.message} *
              </label>
              <TextArea
                rows={4}
                placeholder={t.contact.message}
                value={eventForm.message}
                onChange={(e) => setEventForm({ ...eventForm, message: e.target.value })}
                required
                className="resize-none"
              />
            </div>

            <p className="text-sm text-gray-600">
              {t.contact.recaptchaNotice}
            </p>

            <div className="flex justify-center sm:justify-end">
              <button
                type="submit"
                disabled={eventLoading}
                className="px-8 sm:px-10 py-2 sm:py-2.5 rounded-full border border-primary bg-primary text-white text-sm sm:text-base tracking-wide transition-colors hover:bg-transparent hover:text-[#2d5016] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {eventLoading ? t.common.loading || 'Loading...' : t.contact.send}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
