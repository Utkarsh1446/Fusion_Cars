const express = require('express');
const router = express.Router();

/**
 * Contact Routes
 *
 * Endpoints for contact form submissions
 */

// Store contact messages in memory (in production, use database)
const contactMessages = [];

// POST contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Create contact message object
    const contactMessage = {
      id: Date.now(),
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString(),
      status: 'new',
    };

    // Store message (in production, save to database)
    contactMessages.push(contactMessage);

    // In production, send email notification to admin
    // sendEmailNotification(contactMessage);

    res.status(201).json({
      message: 'Thank you for your message. We will get back to you soon.',
      messageId: contactMessage.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all contact messages (admin only)
router.get('/', async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 10 } = req.query;

    let filteredMessages = contactMessages;
    if (status !== 'all') {
      filteredMessages = contactMessages.filter((msg) => msg.status === status);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;

    const paginatedMessages = filteredMessages.slice(start, end);

    res.json({
      data: paginatedMessages,
      pagination: {
        total: filteredMessages.length,
        page: pageNum,
        pages: Math.ceil(filteredMessages.length / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single contact message
router.get('/:id', async (req, res) => {
  try {
    const message = contactMessages.find((msg) => msg.id == req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update message status (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { status, reply } = req.body;

    const message = contactMessages.find((msg) => msg.id == req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (status) message.status = status;
    if (reply) {
      message.reply = reply;
      message.repliedAt = new Date().toISOString();
    }

    res.json({ message: 'Message updated successfully', data: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE contact message (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const index = contactMessages.findIndex((msg) => msg.id == req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const deletedMessage = contactMessages.splice(index, 1);

    res.json({ message: 'Message deleted successfully', data: deletedMessage[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET contact statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = {
      totalMessages: contactMessages.length,
      newMessages: contactMessages.filter((msg) => msg.status === 'new').length,
      repliedMessages: contactMessages.filter((msg) => msg.status === 'replied').length,
      closedMessages: contactMessages.filter((msg) => msg.status === 'closed').length,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
