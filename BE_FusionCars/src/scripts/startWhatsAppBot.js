const dotenv = require('dotenv');
const connectDB = require('../../config/database');
const whatsappBot = require('../services/whatsappBot');

// Load environment variables
dotenv.config();

/**
 * WhatsApp Bot Standalone Script
 *
 * Run this separately from the main server:
 * npm run whatsapp
 */

async function start() {
  try {
    console.log('🚀 Starting WhatsApp Bot...');

    // Connect to database
    await connectDB();

    // Initialize WhatsApp bot
    await whatsappBot.initialize();

    console.log('✅ WhatsApp Bot is running!');
    console.log('📱 Scan the QR code with WhatsApp to authenticate');

  } catch (error) {
    console.error('❌ Error starting WhatsApp bot:', error);
    process.exit(1);
  }
}

start();
