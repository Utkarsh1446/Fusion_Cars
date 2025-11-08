import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown, Calendar, DollarSign } from 'lucide-react';

/**
 * Financing Calculator Component
 *
 * Calculate EMI and loan details
 * Premium feature that beats BigBoyToyz with:
 * - Real-time EMI calculation
 * - Multiple tenure options
 * - Visual breakdown
 * - Interest comparison
 */

export default function FinancingCalculator({ carPrice = 0 }) {
  const [loanAmount, setLoanAmount] = useState(carPrice * 0.8);
  const [downPayment, setDownPayment] = useState(carPrice * 0.2);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenure, setTenure] = useState(60); // months

  // Calculate EMI using the formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const numberOfMonths = tenure;

    if (principal <= 0 || tenure <= 0) return 0;

    const emi =
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfMonths)) /
      (Math.pow(1 + ratePerMonth, numberOfMonths) - 1);

    return Math.round(emi);
  };

  const emi = calculateEMI();
  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - loanAmount;

  const handleDownPaymentChange = (value) => {
    const dp = parseFloat(value);
    setDownPayment(dp);
    setLoanAmount(carPrice - dp);
  };

  const handleLoanAmountChange = (value) => {
    const loan = parseFloat(value);
    setLoanAmount(loan);
    setDownPayment(carPrice - loan);
  };

  return (
    <div className="bg-primary-dark rounded-lg p-6 md:p-8 border border-accent-charcoal">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="text-accent-silver" size={32} />
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Financing Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Car Price */}
          <div>
            <label className="block text-accent-platinum font-medium mb-2">
              Car Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-stone">
                ₹
              </span>
              <input
                type="number"
                value={carPrice}
                disabled
                className="w-full pl-8 pr-4 py-3 bg-primary-charcoal border border-accent-charcoal rounded-lg text-white"
              />
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-accent-platinum font-medium">
                Down Payment
              </label>
              <span className="text-accent-silver">
                {((downPayment / carPrice) * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={carPrice}
              step="10000"
              value={downPayment}
              onChange={(e) => handleDownPaymentChange(e.target.value)}
              className="w-full h-2 bg-primary-charcoal rounded-lg appearance-none cursor-pointer accent-accent-silver"
            />
            <div className="mt-2 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-stone">
                ₹
              </span>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => handleDownPaymentChange(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-primary-charcoal border border-accent-charcoal rounded-lg text-white"
              />
            </div>
          </div>

          {/* Loan Amount */}
          <div>
            <label className="block text-accent-platinum font-medium mb-2">
              Loan Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-stone">
                ₹
              </span>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => handleLoanAmountChange(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-primary-charcoal border border-accent-charcoal rounded-lg text-white"
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-accent-platinum font-medium">
                Interest Rate (% per annum)
              </label>
              <span className="text-accent-silver">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="6"
              max="15"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-primary-charcoal rounded-lg appearance-none cursor-pointer accent-accent-silver"
            />
          </div>

          {/* Tenure */}
          <div>
            <label className="block text-accent-platinum font-medium mb-3">
              Loan Tenure
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[12, 24, 36, 48, 60, 72, 84, 96].map((months) => (
                <button
                  key={months}
                  onClick={() => setTenure(months)}
                  className={`py-2 px-3 rounded-lg font-medium transition ${
                    tenure === months
                      ? 'bg-accent-silver text-primary-black'
                      : 'bg-primary-charcoal text-accent-stone hover:bg-accent-charcoal'
                  }`}
                >
                  {months / 12}Y
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* EMI Card */}
          <motion.div
            key={emi}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-br from-accent-silver to-accent-platinum rounded-lg p-6 text-primary-black"
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={24} />
              <h3 className="text-lg font-semibold">Monthly EMI</h3>
            </div>
            <p className="text-4xl font-bold">₹{emi.toLocaleString()}</p>
            <p className="text-sm mt-2 opacity-80">per month for {tenure / 12} years</p>
          </motion.div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-charcoal rounded-lg p-4 border border-accent-charcoal">
              <div className="flex items-center gap-2 mb-2 text-accent-stone">
                <TrendingDown size={20} />
                <h4 className="text-sm font-medium">Total Interest</h4>
              </div>
              <p className="text-xl font-bold text-white">
                ₹{totalInterest.toLocaleString()}
              </p>
            </div>

            <div className="bg-primary-charcoal rounded-lg p-4 border border-accent-charcoal">
              <div className="flex items-center gap-2 mb-2 text-accent-stone">
                <Calendar size={20} />
                <h4 className="text-sm font-medium">Total Amount</h4>
              </div>
              <p className="text-xl font-bold text-white">
                ₹{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Payment Breakdown Chart */}
          <div className="bg-primary-charcoal rounded-lg p-6 border border-accent-charcoal">
            <h4 className="text-white font-semibold mb-4">Payment Breakdown</h4>

            {/* Visual Bar */}
            <div className="h-8 flex rounded-lg overflow-hidden mb-4">
              <div
                className="bg-accent-silver"
                style={{ width: `${(loanAmount / totalAmount) * 100}%` }}
              />
              <div
                className="bg-orange-500"
                style={{ width: `${(totalInterest / totalAmount) * 100}%` }}
              />
            </div>

            {/* Legend */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-accent-silver rounded" />
                  <span className="text-sm text-accent-platinum">Principal Amount</span>
                </div>
                <span className="text-white font-medium">
                  ₹{loanAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded" />
                  <span className="text-sm text-accent-platinum">Interest Amount</span>
                </div>
                <span className="text-white font-medium">
                  ₹{totalInterest.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button className="w-full py-3 bg-accent-silver text-primary-black font-bold rounded-lg hover:bg-neutral-light transition">
            Apply for Loan
          </button>

          <p className="text-xs text-accent-stone text-center">
            * This is an indicative calculation. Actual EMI may vary based on lender terms.
          </p>
        </div>
      </div>
    </div>
  );
}
