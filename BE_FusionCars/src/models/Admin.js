const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Admin Model
 *
 * Admin users with elevated privileges for managing the platform
 */

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['super-admin', 'admin', 'manager', 'sales'],
      default: 'admin',
    },
    permissions: [{
      type: String,
      enum: [
        'manage_cars',
        'manage_users',
        'manage_bookings',
        'manage_reviews',
        'view_analytics',
        'manage_admins',
        'manage_settings'
      ],
    }],
    avatar: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    whatsappNumber: {
      type: String, // For WhatsApp bot integration
    },
    whatsappVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check permission
adminSchema.methods.hasPermission = function (permission) {
  if (this.role === 'super-admin') return true;
  return this.permissions.includes(permission);
};

// Don't return password in JSON
adminSchema.methods.toJSON = function () {
  const admin = this.toObject();
  delete admin.password;
  return admin;
};

module.exports = mongoose.model('Admin', adminSchema);
