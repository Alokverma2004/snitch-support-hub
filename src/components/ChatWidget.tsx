
// Get refund status
function getRefundStatus(orderId: string): { active: boolean; message: string } {
  // Mock status logic
  const orderNum = parseInt(orderId.replace(/\D/g, ''));
  
  if (orderNum % 3 === 0) {
    return {
      active: true,
      message: `Your refund for order ${orderId} was processed on May 15. You'll receive the money in your account in 2-3 business days.`
    };
  } else if (orderNum % 3 === 1) {
    return {
      active: true,
      message: `Your refund request for order ${orderId} is being processed. It typically takes 5-7 business days to complete.`
    };
  } else {
    return {
      active: false,
      message: `No active refund found for order ${orderId}.`
    };
  }
}

// Get exchange status
function getExchangeStatus(orderId: string): { active: boolean; message: string } {
  // Mock status logic
  const orderNum = parseInt(orderId.replace(/\D/g, ''));
  
  if (orderNum % 4 === 0) {
    return {
      active: true,
      message: `Your exchange for order ${orderId} has been approved. The new item will be shipped within 2 business days.`
    };
  } else if (orderNum % 4 === 1) {
    return {
      active: true,
      message: `We've received your return for order ${orderId}. We're processing your exchange and will ship the new item soon.`
    };
  } else if (orderNum % 4 === 2) {
    return {
      active: true,
      message: `Your exchange request for order ${orderId} is waiting for your return package. Please use the shipping label we emailed you.`
    };
  } else {
    return {
      active: false,
      message: `No active exchange found for order ${orderId}.`
    };
  }
}

// Get order tracking
function getOrderTracking(identifier: string): { found: boolean; message: string } {
  // Mock tracking logic based on order ID or email
  const isOrderId = identifier.match(/^SNT-\d{6}$/i);
  
  if (isOrderId) {
    const orderNum = parseInt(identifier.replace(/\D/g, ''));
    
    if (orderNum % 5 === 0) {
      return {
        found: true,
        message: `Your order ${identifier} has been delivered on May 18, 2023 at 2:45 PM.`
      };
    } else if (orderNum % 5 === 1) {
      return {
        found: true,
        message: `Your order ${identifier} is out for delivery and will reach you today before 8:00 PM.`
      };
    } else if (orderNum % 5 === 2) {
      return {
        found: true,
        message: `Your order ${identifier} has been shipped and is in transit. Expected delivery: Tomorrow by end of day.`
      };
    } else if (orderNum % 5 === 3) {
      return {
        found: true,
        message: `Your order ${identifier} is being processed and will be shipped within 24 hours.`
      };
    } else {
      return {
        found: true,
        message: `Your order ${identifier} has been received and payment confirmed. We'll process it soon.`
      };
    }
  } else {
    // Simulate email lookup
    return {
      found: true,
      message: `We found 1 recent order associated with ${identifier}. Order SNT-123456 is currently in transit and should be delivered by tomorrow evening.`
    };
  }
}
