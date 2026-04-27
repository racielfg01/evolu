"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BookingForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - would connect to backend in a real application
    console.log(formData)
    alert("Thank you for booking! We'll contact you shortly to confirm your appointment.")
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      service: "",
      date: "",
      time: "",
      message: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Your full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your email address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Your phone number"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Desired Service</Label>
        <Select onValueChange={(value) => handleSelectChange("service", value)} value={formData.service}>
          <SelectTrigger id="service">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="massage">Massage Therapy</SelectItem>
            <SelectItem value="facial">Facial Treatment</SelectItem>
            <SelectItem value="body">Body Treatment</SelectItem>
            <SelectItem value="nails">Nail Care</SelectItem>
            <SelectItem value="package">Spa Package</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Preferred Date</Label>
        <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Preferred Time</Label>
        <Select onValueChange={(value) => handleSelectChange("time", value)} value={formData.time}>
          <SelectTrigger id="time">
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
            <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
            <SelectItem value="evening">Evening (4PM - 8PM)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="message">Special Requests</Label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Any special requests or notes for your appointment"
          className="w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500"
        />
      </div>

      <div className="md:col-span-2 flex justify-center">
        <Button
          type="submit"
          className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-md transition-colors w-full md:w-auto"
        >
          Book Appointment
        </Button>
      </div>
    </form>
  )
}

