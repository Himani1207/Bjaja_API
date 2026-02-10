const express = require('express');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Gemini Key:', process.env.GEMINI_API_KEY);
});

/* ---------- HEALTH ---------- */
app.get('/health', (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: 'himani0436.be23@chitkara.edu.in',
  });
});

/* ---------- BFHL ---------- */
app.post('/bfhl', async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);

    if (keys.length !== 1) {
      return res.status(422).json({
        is_success: false,
        error: 'Exactly one key is required',
      });
    }

    const key = keys[0];
    const value = body[key];

    /* Fibonacci */
    if (key === 'fibonacci') {
      if (!Number.isInteger(value) || value < 1) {
        return res.status(400).json({
          is_success: false,
          error: 'Fibonacci value must be a positive integer',
        });
      }

      const fib = [0, 1];
      for (let i = 2; i < value; i++) {
        fib.push(fib[i - 1] + fib[i - 2]);
      }

      return res.status(200).json({
        is_success: true,
        official_email: 'himani0436.be23@chitkara.edu.in',
        data: fib.slice(0, value),
      });
    }

    /* Prime */
    if (key === 'prime') {
      if (!Array.isArray(value)) {
        return res.status(400).json({
          is_success: false,
          error: 'Prime input must be an array',
        });
      }

      const isPrime = (n) => {
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
          if (n % i === 0) return false;
        }
        return true;
      };

      const result = value.filter(
        (num) => Number.isInteger(num) && isPrime(num),
      );

      return res.status(200).json({
        is_success: true,
        official_email: 'himani0436.be23@chitkara.edu.in',
        data: result,
      });
    }

    /* LCM */
    if (key === 'lcm') {
      if (!Array.isArray(value) || value.length === 0) {
        return res.status(400).json({
          is_success: false,
          error: 'LCM input must be a non-empty array',
        });
      }

      const result = value.reduce((acc, num) => lcm(acc, num));

      return res.status(200).json({
        is_success: true,
        official_email: 'himani0436.be23@chitkara.edu.in',
        data: result,
      });
    }

    /* HCF */
    if (key === 'hcf') {
      if (!Array.isArray(value) || value.length === 0) {
        return res.status(400).json({
          is_success: false,
          error: 'HCF input must be a non-empty array',
        });
      }

      const result = value.reduce((acc, num) => gcd(acc, num));

      return res.status(200).json({
        is_success: true,
        official_email: 'himani0436.be23@chitkara.edu.in',
        data: result,
      });
    }

    /* AI */
    if (key === 'AI') {
      if (typeof value !== 'string') {
        return res.status(400).json({
          is_success: false,
          error: 'AI input must be a string',
        });
      }

      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [
              {
                role: 'user',
                parts: [{ text: value }],
              },
            ],
          },
        );

        const answer =
          response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
          'No answer';

        return res.status(200).json({
          is_success: true,
          official_email: 'himani0436.be23@chitkara.edu.in',
          data: answer.split(' ')[0],
        });
      } catch (err) {
        console.error('Gemini Error:', err.response?.data || err.message);
        return res.status(500).json({
          is_success: false,
          error: 'AI service failed',
        });
      }
    }

    /* Invalid key */
    return res.status(400).json({
      is_success: false,
      error: 'Invalid key',
    });
  } catch (err) {
    return res.status(500).json({
      is_success: false,
      error: 'Internal server error',
    });
  }
});
