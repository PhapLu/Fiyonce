import { User } from "../models/user.model.js"
import QRCode from 'qrcode'

const generateQRCode = async (url) => {
    try {
      return await QRCode.toDataURL(url)
    } catch (err) {
      console.error(err)
      throw new Error('Failed to generate QR code')
    }
}

const createUserQRCode = async (userId) => {
    try {
      const user = await User.findById(userId)
      if (!user) throw new Error('User not found')
  
      // Generate URL to be encoded in the QR code
      const url = `https://pastal.app/users/${userId}`
      const qrCodeData = await generateQRCode(url)
  
      // Save the QR code in the database if it hasn't been saved yet
      if (!user.qrCode) {
        user.qrCode = qrCodeData
        await user.save()
      }
  
      return user.qrCode
    } catch (err) {
      console.error(err)
      throw new Error('Failed to create user QR code')
    }
}

export { createUserQRCode, generateQRCode }