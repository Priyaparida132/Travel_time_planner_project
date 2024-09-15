'use client'

import { useState, useEffect } from 'react'
import PouchDB from 'pouchdb'

export default function TravellingTitans() {
  const [activeTab, setActiveTab] = useState('user')
  const [message, setMessage] = useState('')
  const [userDb, setUserDb] = useState(null)
  const [bookingDb, setBookingDb] = useState(null)
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState('')

  useEffect(() => {
    const initDatabases = async () => {
      const userDatabase = new PouchDB('users')
      const bookingDatabase = new PouchDB('bookings')
      setUserDb(userDatabase)
      setBookingDb(bookingDatabase)
    }
    initDatabases()
  }, [])

  const generateOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000)
    setOtp(newOtp.toString())
    setShowOtpInput(true)
    setMessage(`OTP generated. Check console for OTP: ${newOtp}`)
    console.log('Generated OTP:', newOtp)
  }

  const handleUserSubmit = async (e) => {
    e.preventDefault()
    const enteredOtp = e.target.otp.value
    if (enteredOtp !== otp) {
      setMessage('Invalid OTP. Please try again.')
      return
    }
    const user = {
      _id: new Date().toISOString(),
      name: e.target.name.value,
      mobile: e.target.mobile.value,
      aadhar: e.target.aadhar.value,
      loginTime: new Date().toLocaleString()
    }
    try {
      await userDb.put(user)
      setMessage('User data saved successfully!')
      e.target.reset()
      setShowOtpInput(false)
      // Redirect to destinations page
      // window.location.href = 'web2.html'
    } catch (err) {
      console.error('Error adding user:', err)
      setMessage('Error saving user data. Please try again.')
    }
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    const booking = {
      _id: new Date().toISOString(),
      destination: e.target.destination.value,
      date: e.target.date.value,
      days: e.target.days.value,
      timeSlot: e.target.timeSlot.value
    }
    try {
      await bookingDb.put(booking)
      setMessage('Booking saved successfully!')
      e.target.reset()
    } catch (err) {
      console.error('Error adding booking:', err)
      setMessage('Error saving booking data. Please try again.')
    }
  }

  const handleAdminLogin = (e) => {
    e.preventDefault()
    const adminId = e.target.adminId.value
    const adminPassword = e.target.adminPassword.value

    // Hardcoded admin credentials
    const validAdminId = 'rishi'
    const validAdminPassword = '123'

    if (adminId === validAdminId && adminPassword === validAdminPassword) {
      setMessage('Admin login successful!')
      // Redirect to admin page
      // window.location.href = 'admin.html'
    } else {
      setMessage('Invalid Admin ID or Password.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-orange-500 p-4">
        <ul className="flex justify-center space-x-4">
          <li><a href="#" className="text-white hover:text-yellow-300">Home</a></li>
          <li><a href="#" className="text-white hover:text-yellow-300">Destinations</a></li>
          <li><a href="#" className="text-white hover:text-yellow-300">Booking</a></li>
          <li><a href="#" className="text-white hover:text-yellow-300">Nearby Places</a></li>
          <li><a href="#" className="text-white hover:text-yellow-300">Admin</a></li>
        </ul>
      </nav>

      <div className="container mx-auto p-4 flex">
        <div className="flex-1 bg-cover bg-center text-white p-10" style={{backgroundImage: "url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDF8fHRyYXZlbGV8ZW58MHx8fHwxNjg2MjE4NDg0&ixlib=rb-4.0.3&q=80&w=1080')"}}>
          <h1 className="text-5xl font-bold mb-4 font-pacifico">Discover the World with Travelling Titans</h1>
          <p className="text-2xl">Experience the best travel destinations in India.</p>
        </div>

        <div className="flex-1 bg-white p-10 rounded-lg shadow-lg">
          <div className="flex mb-4 space-x-4">
            <button
              className={`flex-1 py-2 rounded ${activeTab === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('user')}
            >
              User Login
            </button>
            <button
              className={`flex-1 py-2 rounded ${activeTab === 'admin' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Login
            </button>
          </div>

          {activeTab === 'user' && (
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Enter your mobile number"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="aadhar"
                placeholder="Enter your Aadhar number"
                required
                className="w-full p-2 border rounded"
              />
              <button type="button" onClick={generateOtp} className="w-full p-2 bg-orange-500 text-white rounded">
                Generate OTP
              </button>
              {showOtpInput && (
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  required
                  className="w-full p-2 border rounded"
                />
              )}
              {showOtpInput && (
                <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
                  Verify OTP
                </button>
              )}
            </form>
          )}

          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="text"
                name="adminId"
                placeholder="Enter admin ID"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                name="adminPassword"
                placeholder="Enter password"
                required
                className="w-full p-2 border rounded"
              />
              <button type="submit" className="w-full p-2 bg-orange-500 text-white rounded">
                Login
              </button>
            </form>
          )}

          {message && (
            <div className="mt-4 p-2 bg-blue-100 text-blue-700 rounded">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}