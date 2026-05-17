const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Handle specific error types
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ 
      success: false, 
      error: 'Duplicate entry. This record already exists.' 
    });
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid foreign key reference.' 
    });
  }
  
  // Default error
  res.status(err.status || 500).json({ 
    success: false, 
    error: err.message || 'Internal server error' 
  });
};

module.exports = errorHandler;