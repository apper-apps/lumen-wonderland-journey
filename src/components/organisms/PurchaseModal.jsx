import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const PurchaseModal = ({ isOpen, onClose, lesson, onPurchaseComplete }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would process the payment
      if (onPurchaseComplete) {
        await onPurchaseComplete(lesson.Id);
      }
      
      toast.success(`Successfully purchased "${lesson.title}"!`);
      onClose();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-display font-semibold text-gray-900">
                  Complete Purchase
                </h2>
                <Button
                  variant="ghost"
                  size="small"
                  icon="X"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                />
              </div>

              {/* Lesson Summary */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                  <img
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    className="w-20 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=48&fit=crop';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {lesson.instructor}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">
                        {lesson.duration} minutes
                      </span>
                      <span className="text-lg font-semibold text-primary">
                        ${lesson.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePurchase} className="p-6 space-y-4">
                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    icon="CreditCard"
                    required
                    maxLength={19}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="MM/YY"
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      placeholder="12/25"
                      required
                      maxLength={5}
                    />
                    <Input
                      label="CVV"
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      required
                      maxLength={4}
                    />
                  </div>

                  <Input
                    label="Cardholder Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                    icon="User"
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    icon="Mail"
                    required
                  />
                </div>

                {/* Security Notice */}
                <div className="bg-surface rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ApperIcon name="Shield" size={20} className="text-success mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Secure Payment
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Your payment information is encrypted and secure. We never store your card details.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="flex-1"
                  >
                    {loading ? 'Processing...' : `Pay $${lesson.price}`}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PurchaseModal;