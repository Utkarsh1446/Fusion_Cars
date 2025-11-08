const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Car = require('../models/Car');
const Admin = require('../models/Admin');
const Booking = require('../models/Booking');

/**
 * WhatsApp Bot Service
 *
 * Admin operations via WhatsApp commands
 *
 * Commands:
 * - /create - Create new car listing (guided flow)
 * - /list - View all active listings
 * - /update [id] - Update car listing
 * - /delete [id] - Delete car listing
 * - /sold [id] - Mark car as sold
 * - /stats - View platform statistics
 * - /bookings - View pending bookings
 * - /help - Show all commands
 */

class WhatsAppBotService {
  constructor() {
    this.client = null;
    this.adminNumbers = new Map(); // Store verified admin numbers
    this.conversationStates = new Map(); // Track ongoing conversations
  }

  async initialize() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    // QR Code for authentication
    this.client.on('qr', (qr) => {
      console.log('🔗 WhatsApp Bot - Scan QR Code:');
      qrcode.generate(qr, { small: true });
    });

    // Bot ready
    this.client.on('ready', async () => {
      console.log('✅ WhatsApp Bot is ready!');
      await this.loadAdminNumbers();
    });

    // Handle incoming messages
    this.client.on('message', async (msg) => {
      await this.handleMessage(msg);
    });

    // Error handling
    this.client.on('auth_failure', (msg) => {
      console.error('❌ WhatsApp Auth Failure:', msg);
    });

    this.client.on('disconnected', (reason) => {
      console.log('⚠️  WhatsApp Bot disconnected:', reason);
    });

    await this.client.initialize();
  }

  async loadAdminNumbers() {
    try {
      const admins = await Admin.find({ whatsappVerified: true });
      admins.forEach((admin) => {
        if (admin.whatsappNumber) {
          this.adminNumbers.set(admin.whatsappNumber, {
            adminId: admin._id,
            name: admin.name,
            permissions: admin.permissions,
          });
        }
      });
      console.log(`📱 Loaded ${this.adminNumbers.size} verified admin numbers`);
    } catch (error) {
      console.error('Error loading admin numbers:', error);
    }
  }

  isAdmin(phoneNumber) {
    // Clean phone number format
    const cleaned = phoneNumber.replace(/[^\d]/g, '');
    return this.adminNumbers.has(cleaned) || this.adminNumbers.has(phoneNumber);
  }

  getAdmin(phoneNumber) {
    const cleaned = phoneNumber.replace(/[^\d]/g, '');
    return this.adminNumbers.get(cleaned) || this.adminNumbers.get(phoneNumber);
  }

  async handleMessage(msg) {
    try {
      const from = msg.from;
      const text = msg.body.trim();

      // Check if user is admin
      if (!this.isAdmin(from)) {
        if (text.startsWith('/')) {
          await msg.reply(
            '⛔ Unauthorized. This bot is for admin use only.\n\nTo request access, contact the super admin.'
          );
        }
        return;
      }

      const admin = this.getAdmin(from);

      // Handle commands
      if (text.startsWith('/')) {
        await this.handleCommand(msg, text, admin);
      } else if (this.conversationStates.has(from)) {
        // Handle ongoing conversations (like creating a car)
        await this.handleConversation(msg, from, admin);
      }
    } catch (error) {
      console.error('Error handling WhatsApp message:', error);
      await msg.reply('❌ An error occurred. Please try again.');
    }
  }

  async handleCommand(msg, text, admin) {
    const parts = text.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case '/help':
        await this.sendHelp(msg);
        break;

      case '/create':
        await this.startCreateCar(msg, admin);
        break;

      case '/list':
        await this.listCars(msg, args);
        break;

      case '/update':
        await this.startUpdateCar(msg, args, admin);
        break;

      case '/delete':
        await this.deleteCar(msg, args, admin);
        break;

      case '/sold':
        await this.markCarSold(msg, args, admin);
        break;

      case '/stats':
        await this.sendStats(msg);
        break;

      case '/bookings':
        await this.sendBookings(msg);
        break;

      case '/featured':
        await this.toggleFeatured(msg, args, admin);
        break;

      default:
        await msg.reply(
          `❓ Unknown command: ${command}\n\nType /help to see all available commands.`
        );
    }
  }

  async sendHelp(msg) {
    const helpText = `
🤖 *Fusion Cars Admin Bot*

📝 *Car Management:*
/create - Create new car listing
/list [page] - View all listings
/update [id] - Update car details
/delete [id] - Delete a listing
/sold [id] - Mark car as sold
/featured [id] - Toggle featured status

📊 *Analytics:*
/stats - Platform statistics
/bookings - View pending bookings

💡 *Tip:* Use car ID from /list command for update/delete operations
    `.trim();

    await msg.reply(helpText);
  }

  async startCreateCar(msg, admin) {
    if (!admin.permissions.includes('manage_cars')) {
      await msg.reply('⛔ You don\'t have permission to create car listings.');
      return;
    }

    this.conversationStates.set(msg.from, {
      action: 'create_car',
      step: 'brand',
      data: {},
      adminId: admin.adminId,
    });

    await msg.reply(
      '🚗 *Create New Car Listing*\n\nStep 1/10\nEnter the *brand* (e.g., Mercedes-Benz, BMW, Audi):'
    );
  }

  async handleConversation(msg, from, admin) {
    const state = this.conversationStates.get(from);

    if (state.action === 'create_car') {
      await this.handleCreateCarFlow(msg, state);
    } else if (state.action === 'update_car') {
      await this.handleUpdateCarFlow(msg, state);
    }
  }

  async handleCreateCarFlow(msg, state) {
    const text = msg.body.trim();

    if (text.toLowerCase() === '/cancel') {
      this.conversationStates.delete(msg.from);
      await msg.reply('❌ Car creation cancelled.');
      return;
    }

    const stepHandlers = {
      brand: {
        next: 'model',
        prompt: 'Step 2/10\nEnter the *model*:',
        handler: (value) => ({ brand: value }),
      },
      model: {
        next: 'year',
        prompt: 'Step 3/10\nEnter the *year*:',
        handler: (value) => ({ model: value }),
      },
      year: {
        next: 'price',
        prompt: 'Step 4/10\nEnter the *price* (in ₹):',
        handler: (value) => ({ year: parseInt(value) }),
      },
      price: {
        next: 'kmsDriven',
        prompt: 'Step 5/10\nEnter *kilometers driven*:',
        handler: (value) => ({ price: parseInt(value) }),
      },
      kmsDriven: {
        next: 'fuelType',
        prompt: 'Step 6/10\nEnter *fuel type* (Petrol/Diesel/Electric/Hybrid/CNG):',
        handler: (value) => ({ kmsDriven: parseInt(value) }),
      },
      fuelType: {
        next: 'transmission',
        prompt: 'Step 7/10\nEnter *transmission* (Manual/Automatic):',
        handler: (value) => ({ fuelType: value }),
      },
      transmission: {
        next: 'color',
        prompt: 'Step 8/10\nEnter *color*:',
        handler: (value) => ({ transmission: value }),
      },
      color: {
        next: 'owners',
        prompt: 'Step 9/10\nEnter number of *previous owners*:',
        handler: (value) => ({ color: value }),
      },
      owners: {
        next: 'image',
        prompt: 'Step 10/10\nEnter *image URL*:',
        handler: (value) => ({ owners: parseInt(value) }),
      },
      image: {
        next: 'finish',
        prompt: null,
        handler: (value) => ({ image: value }),
      },
    };

    const currentStepHandler = stepHandlers[state.step];

    if (currentStepHandler) {
      // Process current step data
      Object.assign(state.data, currentStepHandler.handler(text));

      if (currentStepHandler.next === 'finish') {
        // Create the car
        await this.finishCreateCar(msg, state);
      } else {
        // Move to next step
        state.step = currentStepHandler.next;
        await msg.reply(stepHandlers[state.step].prompt);
      }
    }
  }

  async finishCreateCar(msg, state) {
    try {
      // Create car with collected data
      const carData = {
        name: `${state.data.brand} ${state.data.model}`,
        brand: state.data.brand,
        model: state.data.model,
        year: state.data.year,
        price: state.data.price,
        kmsDriven: state.data.kmsDriven,
        fuelType: state.data.fuelType,
        transmission: state.data.transmission,
        color: state.data.color,
        owners: state.data.owners,
        image: state.data.image,
        images: [{ url: state.data.image, isPrimary: true }],
        mileage: '15 km/l', // Default
        engineCapacity: '2000cc', // Default
        seating: 5, // Default
        createdBy: state.adminId,
        lastUpdatedBy: state.adminId,
      };

      const car = new Car(carData);
      await car.save();

      this.conversationStates.delete(msg.from);

      const summary = `
✅ *Car Created Successfully!*

*ID:* ${car._id}
*Car:* ${car.name}
*Year:* ${car.year}
*Price:* ₹${car.price.toLocaleString()}
*KMs:* ${car.kmsDriven.toLocaleString()}
*Fuel:* ${car.fuelType}
*Transmission:* ${car.transmission}
*Color:* ${car.color}

The listing is now live on the platform!
      `.trim();

      await msg.reply(summary);
    } catch (error) {
      console.error('Error creating car:', error);
      await msg.reply(`❌ Error creating car: ${error.message}`);
      this.conversationStates.delete(msg.from);
    }
  }

  async listCars(msg, args) {
    try {
      const page = parseInt(args[0]) || 1;
      const limit = 5;
      const skip = (page - 1) * limit;

      const cars = await Car.find({ available: true, sold: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id name year price kmsDriven fuelType');

      const total = await Car.countDocuments({ available: true, sold: false });
      const pages = Math.ceil(total / limit);

      if (cars.length === 0) {
        await msg.reply('No active listings found.');
        return;
      }

      let response = `🚗 *Active Listings* (Page ${page}/${pages})\n\n`;

      cars.forEach((car, index) => {
        response += `${index + 1}. *${car.name}*\n`;
        response += `   ID: \`${car._id}\`\n`;
        response += `   Year: ${car.year} | ₹${(car.price / 100000).toFixed(2)}L\n`;
        response += `   ${car.kmsDriven.toLocaleString()} km | ${car.fuelType}\n\n`;
      });

      if (page < pages) {
        response += `\n_Type /list ${page + 1} for next page_`;
      }

      await msg.reply(response);
    } catch (error) {
      await msg.reply(`❌ Error: ${error.message}`);
    }
  }

  async deleteCar(msg, args, admin) {
    if (!admin.permissions.includes('manage_cars')) {
      await msg.reply('⛔ You don\'t have permission to delete listings.');
      return;
    }

    if (!args[0]) {
      await msg.reply('❌ Usage: /delete [car_id]\n\nGet car ID from /list command.');
      return;
    }

    try {
      const car = await Car.findByIdAndDelete(args[0]);

      if (!car) {
        await msg.reply('❌ Car not found.');
        return;
      }

      await msg.reply(`✅ Deleted: ${car.name}`);
    } catch (error) {
      await msg.reply(`❌ Error: ${error.message}`);
    }
  }

  async markCarSold(msg, args, admin) {
    if (!admin.permissions.includes('manage_cars')) {
      await msg.reply('⛔ You don\'t have permission to update listings.');
      return;
    }

    if (!args[0]) {
      await msg.reply('❌ Usage: /sold [car_id]');
      return;
    }

    try {
      const car = await Car.findByIdAndUpdate(
        args[0],
        {
          sold: true,
          soldDate: new Date(),
          available: false,
          status: 'sold',
        },
        { new: true }
      );

      if (!car) {
        await msg.reply('❌ Car not found.');
        return;
      }

      await msg.reply(`✅ Marked as SOLD: ${car.name}\n💰 Price: ₹${car.price.toLocaleString()}`);
    } catch (error) {
      await msg.reply(`❌ Error: ${error.message}`);
    }
  }

  async toggleFeatured(msg, args, admin) {
    if (!admin.permissions.includes('manage_cars')) {
      await msg.reply('⛔ You don\'t have permission to update listings.');
      return;
    }

    if (!args[0]) {
      await msg.reply('❌ Usage: /featured [car_id]');
      return;
    }

    try {
      const car = await Car.findById(args[0]);

      if (!car) {
        await msg.reply('❌ Car not found.');
        return;
      }

      car.featured = !car.featured;
      await car.save();

      await msg.reply(
        `${car.featured ? '⭐' : '📍'} ${car.name} is now ${car.featured ? 'FEATURED' : 'UNFEATURED'}`
      );
    } catch (error) {
      await msg.reply(`❌ Error: ${error.message}`);
    }
  }

  async sendStats(msg) {
    try {
      const [totalCars, availableCars, soldCars, totalBookings, pendingBookings] = await Promise.all([
        Car.countDocuments(),
        Car.countDocuments({ available: true, sold: false }),
        Car.countDocuments({ sold: true }),
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'pending' }),
      ]);

      // Calculate revenue (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentSales = await Car.aggregate([
        { $match: { sold: true, soldDate: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$price' }, count: { $sum: 1 } } },
      ]);

      const revenue = recentSales[0] || { total: 0, count: 0 };

      const stats = `
📊 *Platform Statistics*

🚗 *Inventory:*
Total Cars: ${totalCars}
Available: ${availableCars}
Sold: ${soldCars}

📅 *Bookings:*
Total: ${totalBookings}
Pending: ${pendingBookings}

💰 *Revenue (30 days):*
Sales: ${revenue.count}
Amount: ₹${(revenue.total / 100000).toFixed(2)} Lakh

_Last updated: ${new Date().toLocaleString()}_
      `.trim();

      await msg.reply(stats);
    } catch (error) {
      await msg.reply(`❌ Error: ${error.message}`);
    }
  }

  async sendBookings(msg) {
    try {
      const bookings = await Booking.find({ status: 'pending' })
        .populate('user', 'firstName lastName phone')
        .populate('car', 'name price')
        .sort({ createdAt: -1 })
        .limit(5);

      if (bookings.length === 0) {
        await msg.reply('📋 No pending bookings.');
        return;
      }

      let response = '📋 *Pending Bookings*\n\n';

      bookings.forEach((booking, index) => {
        response += `${index + 1}. *${booking.car.name}*\n`;
        response += `   Customer: ${booking.user.firstName} ${booking.user.lastName}\n`;
        response += `   Phone: ${booking.user.phone}\n`;
        response += `   Date: ${new Date(booking.preferredDate).toLocaleDateString()}\n\n`;
      });

      await msg.reply(response);
    } catch (error) {
      await msg.reply(`❌ Error: ${error.message}`);
    }
  }

  async sendNotification(phoneNumber, message) {
    try {
      if (this.client) {
        const chatId = `${phoneNumber}@c.us`;
        await this.client.sendMessage(chatId, message);
      }
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
    }
  }
}

module.exports = new WhatsAppBotService();
